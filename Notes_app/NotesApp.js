(function() {
    var customStorage = {
        setItem: function(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        getItem: function(key) {
            return JSON.parse(localStorage.getItem(key));
        },
        removeItem: function(key) {
            localStorage.removeItem(key);
        },
        clear: function() {
            localStorage.clear();
        }
    }

    var copy = function(obj)
    {
        return JSON.parse(JSON.stringify(obj));
    }

    var Note = function() {
        this.num = 0;
        this.heading = '';
        this.note = '';
        this.isGreen = false;
    }


    var app = new Vue({
        el: '#vueApp',
        data: {
            curr_id: 0,
            loading: false,
            tableTitle: '',
            NotesShow: false,
            formShown: false,
            NoteItem: new Note,
            editingItem: null,
            AddingNote: false,
            isShowData: false,
            selectedNotes:[],
            list: [],
            color_picked: {},
        },
        created: function() {
            this.color_picked.type = "White"
            ids = []
            for ( var i = 0, len = localStorage.length; i < len; ++i ) {
                ids.push(localStorage.key( i ));
                this.list.push(customStorage.getItem((localStorage.key( i ))));
            }
            if (localStorage.length > 0) {
                this.curr_id = Math.max.apply(null, ids)+1;
            }

            else {
                this.curr_id = 0;
            }

            this.NotesShow = true;
        },

      methods: {
        addNote: function() {
            this.AddingNote= true;
        },

        cancel: function() {
            this.AddingNote= false;
            this.NoteItem.heading = '';
            this.NoteItem.note = '';
        },

        saveNote: function() {
            this.AddingNote= false;
            var t = this;

            if (this.color_picked.type == "Green") {
                this.NoteItem.isGreen = true;
            }
            else {
                this.NoteItem.isGreen = false;
            }


            if (this.editingItem != null)
            {   

                this.editingItem.heading = this.NoteItem.heading;
                this.editingItem.note = this.NoteItem.note;
                this.editingItem.num = this.NoteItem.num;
                this.editingItem.isGreen = this.NoteItem.isGreen;
                
                customStorage.setItem(this.editingItem.num, copy(t.NoteItem));
                this.editingItem = null;
            }
            else
            {
                this.NoteItem.num = this.curr_id;
				this.list.push(copy(t.NoteItem));
                customStorage.setItem(this.curr_id, copy(t.NoteItem));
            }

            
            this.NoteItem.heading = '';
            this.NoteItem.note = '';
            this.curr_id += 1;
            this.itemForm = new Note;
            this.showNotes();

        },

        showData: function() {
            this.isShowData = true; 
            this.data
        },

        editItem: function(note) {
            this.editingItem = note;
            this.NoteItem.heading = this.editingItem.heading;
            this.NoteItem.note = this.editingItem.note;
            this.NoteItem.num = this.editingItem.num;
            if (this.editingItem.isGreen == true) {
                this.color_picked.type = "Green";
            }
            else {
                this.color_picked.type = "White";
            }
            this.NoteItem.isGreen = this.editingItem.isGreen;

            this.AddingNote= true;
        },

        delNote: function(note) {
            this.list.splice(this.list.indexOf(note), 1);
            customStorage.removeItem(note.num);

        },

        delChecked: function() {
            //this.selectedNotes =  this.selectedNotes.sort();

            var t = this;

            this.selectedNotes.forEach(function(item) {
                t.list.splice(item.index, 1);
                customStorage.removeItem(item.num);
            });


            this.selectedNotes = [];
            
        },

        clearSrorage: function() {
            this.list = [];
        	customStorage.clear();
            this.curr_id = 0;
        },


        showForm: function() {
            this.formShown = true;
            this.tableShown = false;
            this.tableTitle = 'Show Table';
        },


        showNotes: function() {
            this.formShown = false;
            this.tableShown = true;
            this.tableTitle = '';
        },
        
      }

    });
})();