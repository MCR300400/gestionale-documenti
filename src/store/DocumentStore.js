import { defineStore } from 'pinia';

export const useDocumentStore = defineStore('documentStore', {
  state: () => ({
    selectedFiles: [],
    uploadStatus: '',
    documents: [],
  }),
  actions: {
    setSelectedFiles(files) {
      this.selectedFiles = files || [];
    },
    async uploadDocuments() {
      if (this.selectedFiles.length === 0) {
        this.uploadStatus = 'No files selected for upload.';
        return;
      }
 
      const formData = new FormData();
      this.selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      try {
        const response = await fetch('/document/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          this.uploadStatus = 'Files uploaded successfully!';
        } else {
          this.uploadStatus = 'Failed to upload files.';
        }
      } catch (error) {
        this.uploadStatus = 'Error occurred during upload.';
        console.error('Upload error:', error);
      }
    },
    async fetchDocumentsDownload() {
      try {
        const token = localStorage.getItem("authToken")
        const response = await fetch('/document/listFiles',
          {
            headers: {'Authorization': token },
          }
        );
        if (response.ok) {
          const fileNames = await response.json();
          this.documents = fileNames.map(name => ({
            name,
            url: `http://localhost:8081/document/download/${name}`,
            description: 'No description available', // Puoi aggiornare la descrizione se necessario
          }));
        } else {
          console.error('Failed to fetch documents');
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    },
    async fetchDocuments() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/documnentinfo/load', {
          headers: {
            'Authorization': token // Invia il token nell'intestazione senza 'Bearer'
          }
        });
        if (response.ok) {
          this.documents = await response.json();
        } else {
          console.error('Failed to fetch documents');
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    },
    async fetchDocument(id) {
      try {
        const token = localStorage.getItem("authToken")
        const response = await fetch(`/document/documentinfo/${id}`,
          {
            headers: {'Authorization': token },
          }
        );
        if (response.ok) {
          return await response.json();
        } else {
          console.error('Failed to fetch document');
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    },
    async createDocument(document) {
      try {
        const token = localStorage.getItem("authToken")
        const response = await fetch('/document/documentinfo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': token  },
          body: JSON.stringify(document),
        });
        if (response.ok) {
          await this.fetchDocuments();
        } else {
          console.error('Failed to create document');
        }
      } catch (error) {
        console.error('Create error:', error);
      }
    },
    async updateDocument(document) {
      try {
        const token = localStorage.getItem("authToken")
        const response = await fetch('/document/documentinfo', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': token  },
          body: JSON.stringify(document),
        });
        if (response.ok) {
          await this.fetchDocuments();
        } else {
          console.error('Failed to update document');
        }
      } catch (error) {
        console.error('Update error:', error);
      }
    },
    async deleteDocument(id) {
      try {
        const token = localStorage.getItem("authToken")
        const response = await fetch(`/document/documentinfo/${id}`, {
          method: 'DELETE',
          headers: {'Authorization': token },
        });
        if (response.ok) {
          await this.fetchDocuments();
        } else {
          console.error('Failed to delete document');
        }
      } catch (error) {
        console.error('Delete error:', error);
      }
    },
  },

});
