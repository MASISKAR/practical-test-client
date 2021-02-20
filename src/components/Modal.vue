<template>
  <b-modal
      size="lg"
      :visible="true"
      :centered="true"
      @close="closeModal"
      @hide="closeModal"
  >
    <template #modal-header>
      <h5>{{ title[mode] }}</h5>
    </template>

    <template #modal-footer="{ cancel}">
      <b-button size="sm" variant="outline-danger" @click="cancel()">
        Cancel
      </b-button>
      <b-button size="sm" variant="outline-success" @click="handleSubmit">
        Save
      </b-button>
    </template>

    <b-container>
      <b-row class="mb-3">
        <b-col sm="2" class="text-right">
          <label :for="'name-input'">Name:</label>
        </b-col>
        <b-col sm="10">
          <b-form-input
              type="text"
              name="name"
              v-model="client.name"
          />
        </b-col>
      </b-row>

      <b-row class="mb-3">
        <b-col sm="2" class="text-right">
          <label :for="'email-input'">Email:</label>
        </b-col>
        <b-col sm="10">
          <b-form-input
              type="email"
              name="email"
              v-model="client.email"
          />
        </b-col>
      </b-row>

      <b-row class="mb-3">
        <b-col sm="2" class="text-right">
          <label :for="'phone-input'">Phone:</label>
        </b-col>
        <b-col sm="10">
          <b-form-input
              type="text"
              name="phone"
              v-model="client.phone"
          />
        </b-col>
      </b-row>

      <b-row class="mb-3">
        <b-col sm="2" md="2" lg="2" class="text-right">
          <label :for="'new-provider-input'">Providers:</label>
        </b-col>
        <b-col sm="6" md="6" lg="7">
          <b-form-input
              type="text"
              v-model="newProvider"
          />
        </b-col>
        <b-col sm="4" md="4" lg="3">
          <b-button
              class="add-provider-button"
              variant="primary"
              @click="addNewProvider"
          >
            Add Provider
          </b-button>
        </b-col>
      </b-row>

      <b-row>
        <b-col sm="7" offset-sm="2">
          <div class="border rounded p-3 providers-container">
            <provider
                v-for="provider in allProviders"
                :key="provider._id"
                :info="provider"
                :selected="selectedProviders.has(provider._id)"
                @select="handleSelectProvider"
                @remove="handleRemoveProvider"
                @edit="handleEditProvider"
            />
          </div>
        </b-col>

      </b-row>
    </b-container>

  </b-modal>
</template>

<script>
import provider from './Provider';
import {snackbarEmitter} from '@/utils/snackbarEmitter';

export default {
  name: 'Modal',
  components: {
    provider
  },
  props: {
    mode: {
      type: String,
      required: true,
      validator: (val) => ['add', 'edit'].includes(val)
    }
  },
  data() {
    return {
      title: {
        add: 'Create new client',
        edit: 'Edit client'
      },
      allProviders: [],
      selectedProviders: new Set(),
      newProvider: '',
      client: {
        _id: null,
        name: '',
        email: '',
        phone: '',
      }
    };
  },

  methods: {
    closeModal(event) {
      event.preventDefault();
      this.$emit('cancel');
    },

    handleSelectProvider(providerId) {
      const selectedProviders = new Set(this.selectedProviders);
      if (selectedProviders.has(providerId)) {
        selectedProviders.delete(providerId);
      }
      else {
        selectedProviders.add(providerId);
      }
      this.selectedProviders = selectedProviders;
    },

    addNewProvider() {
      const newProvider = this.newProvider.trim();
      if (!newProvider) {
        return;
      }
      this.$http.post('provider', {
        name: newProvider
      })
      .then(response => {
        this.allProviders.push(response.data);
        this.newProvider = '';
        snackbarEmitter.success('Provider created successfully!');
      })
      .catch(snackbarEmitter.error);
    },

    handleRemoveProvider(providerId) {
      this.$http.delete(`provider/${providerId}`)
      .then(() => {
        this.allProviders = this.allProviders.filter(({_id}) => _id !== providerId);
        snackbarEmitter.success('Provider removed successfully!');
      })
      .catch(snackbarEmitter.error);
    },

    handleEditProvider(data) {
      this.$http.put(`provider/${data._id}`, data)
      .then((response) => {
        const allProviders = [...this.allProviders];
        const index = allProviders.findIndex(({_id}) => _id === data._id);
        allProviders[index] = response.data;
        this.allProviders = allProviders;
        snackbarEmitter.success('Provider edited successfully!');
      })
      .catch(snackbarEmitter.error);
    },

    handleSubmit() {
      const client = {
        ...this.client,
        providers: [...this.selectedProviders]
      };

      this.$emit('submit', client, this.client._id);
    }
  },
  created() {
    const clientId = this.$route.query.client;
    if (clientId && this.mode === 'edit') {
      this.$http.get(`client/${clientId}`)
      .then(response => {
        const client = response.data;
        this.client = client;
        this.selectedProviders = new Set(client.providers.map(({_id}) => _id));
      })
      .catch(snackbarEmitter.error);
    }

    this.$http.get('provider')
    .then(response => {
      this.allProviders = response.data;
    })
    .catch(snackbarEmitter.error);
  }
}
</script>

<style scoped lang="css">
.add-provider-button {
  width: 100%;
}

.providers-container {
  max-height: 20vh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
