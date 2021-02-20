<template>
  <b-container>
    <b-row class="text-center m-4">
      <b-col cols="12">
        <h2>List of clients</h2>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <b-table
            :busy="loading"
            :bordered="true"
            :hover="true"
            :items="clients"
            :fields="fields"
            :responsive="true"
        >

          <template #thead-top>
            <b-tr>
              <b-th variant="secondary" colspan="5">
                <div class="table-head">
                  <span>Clients (total: {{ clients.length }})</span>
                  <b-button
                      variant="primary"
                      @click="toggleAddModal"
                  >
                    New Client
                  </b-button>
                </div>
              </b-th>
            </b-tr>
          </template>

          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong class="m-2">Loading...</strong>
            </div>
          </template>

          <template #cell(providers)="data">
            {{ getProvidersNames(data.item.providers) }}
          </template>

          <template #cell(actions)="data">
            <div class="actions">
              <b-icon-pencil-square
                  :variant="'success'"
                  :scale="1.2"
                  class="action-icon"
                  title="Edit"
                  @click="()=>toggleEditModal(data.item._id)"
              />
              <b-icon-trash-fill
                  :variant="'danger'"
                  :scale="1.2"
                  class="action-icon"
                  title="Delete"
                  @click="()=>handleRemove(data.item._id)"
              />
            </div>
          </template>
        </b-table>

      </b-col>
    </b-row>

    <modal
        v-if="showAddModal"
        mode="add"
        @cancel="toggleAddModal"
        @submit="addNewClient"
    />

    <modal
        v-if="showEditModal"
        mode="edit"
        @cancel="toggleEditModal"
        @submit="editClient"
    />
  </b-container>

</template>

<script>
import modal from './Modal';
import {snackbarEmitter} from '@/utils/snackbarEmitter';

export default {
  name: 'ClientsList',
  components: {
    modal
  },
  data() {
    return {
      fields: ['name', 'email', 'phone', 'providers', 'actions'],
      clients: [],
      loading: true,
      showAddModal: this.$route.query.modal === 'add',
      showEditModal: this.$route.query.modal === 'edit' && this.$route.query.client
    };
  },
  methods: {
    getProvidersNames(providers) {
      return providers.map(({name}) => name).join(', ');
    },

    handleRemove(clientId) {
      this.$http.delete(`client/${clientId}`)
          .then(() => {
            this.clients = this.clients.filter(({_id}) => _id !== clientId);
            snackbarEmitter.success('Client removed successfully!');
          })
          .catch(snackbarEmitter.error);
    },

    toggleAddModal() {
      const path = this.showAddModal ? '/' : `?modal=add`;
      this.$router.push(path);
      this.showAddModal = !this.showAddModal;

    },

    toggleEditModal(clientId = null) {
      const path = clientId ? `?modal=edit&client=${clientId}` : '/';
      this.$router.push(path);
      this.showEditModal = !this.showEditModal;
    },

    addNewClient(data) {
      this.$http.post('client', data)
          .then(response => {
            this.clients.push(response.data);
            this.toggleAddModal();
            snackbarEmitter.success('Client created successfully!');
          })
          .catch(snackbarEmitter.error);
    },

    editClient(data, clientId) {
      this.$http.put(`client/${clientId}`, data)
          .then(response => {
            const clients = [...this.clients];
            const index = clients.findIndex(({_id}) => _id === clientId);
            clients[index] = response.data;
            this.clients = clients;
            this.toggleEditModal();
            snackbarEmitter.success('Client edited successfully!');
          })
          .catch(snackbarEmitter.error);
    }
  },
  created() {
    this.$http.get('client')
        .then(response => {
          this.clients = response.data;
          this.loading = false;
        })
        .catch(snackbarEmitter.error);
  }
}
</script>

<style scoped lang="css">
.table-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-head span {
  font-size: 20px;
  font-weight: 800;
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
}

.action-icon {
  margin: 4px 7px;
}

.action-icon:hover {
  cursor: pointer;
}
</style>
