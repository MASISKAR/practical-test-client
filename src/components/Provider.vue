<template>
  <b-container fluid="true" class="provider-container">
    <b-row>
      <b-col cols="9">
        <b-form-checkbox
            v-if="!editMode"
            :checked="selected"
            @change="()=>this.$emit('select', info._id)"
        >
          {{ info.name }}
        </b-form-checkbox>

        <b-form-checkbox
            v-else
            disabled
        >
          <b-form-input
              class="edit-input"
              type="text"
              :value="name"
              v-model = "name"
          />
        </b-form-checkbox>
      </b-col>

      <b-col cols="3" class="text-right">
        <div
            class="actions"
            v-if="!editMode"
        >
          <b-icon-pencil-square
              :variant="'success'"
              :scale="1"
              class="action-icon"
              title="Edit"
              @click="toggleEdit"
          />
          <b-icon-trash-fill
              :variant="'danger'"
              :scale="1"
              class="action-icon"
              title="Delete"
              @click="()=>this.$emit('remove', info._id)"
          />
        </div>

        <div
            class="actions"
            v-else
        >
          <b-icon-check2-square
              :variant="'success'"
              :scale="1"
              class="action-icon"
              title="Save"
              @click="handleSave"
          />
          <b-icon-x-square
              :variant="'danger'"
              :scale="1"
              class="action-icon"
              title="Cancel"
              @click="toggleEdit"
          />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Provider',
  props: {
    info: Object,
    selected: Boolean,
  },

  data() {
    return {
      name: this.info.name,
      editMode: false
    };
  },
  methods: {
    toggleEdit() {
      if(!this.editMode){
        this.name = this.info.name;
      }
      this.editMode = !this.editMode;
    },
    handleSave() {
      const name = this.name.trim();
      if (!name) return;

      this.$emit('edit', {
        _id: this.info._id,
        name
      });
      this.editMode = false;
    }
  }
}
</script>

<style scoped lang="css">
.action-icon {
  margin: 0 5px;
}

.action-icon:hover{
  cursor: pointer;
}

.provider-container:hover {
  background-color: rgba(0, 0, 0, 0.075);
}

.edit-input {
  padding: 5px;
  height: 25px;
}
</style>
