CRM.BookingApp.module('AddSubResource', function(AddSubResource, BookingApp, Backbone, Marionette, $, _) {

  CRM.BookingApp.vent.on("render:options", function (options){
    var template = _.template($('#select-option-template').html());
    var select = options.context.$el.find(options.element);
    if(select.is('[disabled]')){
      select.prop('disabled', false);
    }
    select.html(template({options: options.list, first_option: options.first_option}));
  });

  AddSubResource.ResourceTableView = Backbone.Marionette.ItemView.extend({
    template: '#resource-table-template',
    events: {
      'click .add-sub-resource': 'addSubResource',
      'click .edit-adhoc-charge': 'editAdhocCharge',
      'click .collapsed' : 'toggleHiddenElement',
    },
    addSubResource: function(e){
     var ref = $(e.currentTarget).data('ref');
     var date = $(e.currentTarget).data('date');
     CRM.api('BookingResource', 'get', {'sequential': 1, ' is_unlimited': 1, 'is_deleted': 0, 'is_active': 1},
      {success: function(data) {
          var view = new AddSubResource.AddSubResourceModal({resources: data.values});
          CRM.BookingApp.modal.show(view);
        }
      }
    );
    },
    editAdhocCharge: function(e){
      var view = new AddSubResource.EditAdhocChargesModal();
     CRM.BookingApp.modal.show(view);
    },
    toggleHiddenElement: function(e){
      var row = $(e.currentTarget).data('ref');
      $('#crm-booking-sub-resource-row-' + row).toggle();
    }
  });

  AddSubResource.AddSubResourceModal = Backbone.Marionette.ItemView.extend({
    template: "#add-sub-resource-template",
    //model: CRM.BookingApp.Entities.SubResourceModel,
    initialize: function(options){
      this.resources = options.resources;
    },

    events: {
      'click #add-to-basket': 'addSubResource',
      'click .cancel': 'addSubResource',
      'change #resourceSelect': 'getConfigurations',
    },
    onRender: function(){
      var params = {context:this, list: this.resources, element: "#resourceSelect", first_option: '- ' + ts('select resource') + ' -'}
      CRM.BookingApp.vent.trigger("render:options", params);
    },

    getConfigurations: function(e){
      selectedVal = $('#resourceSelect').val();
      if(selectedVal !== ""){
        var params = {
              id: selectedVal,
              sequential: 1,
              'api.booking_resource_config_set.get': {
                id: '$value.set_id',
                'api.booking_resource_config_option.get': {
                  set_id: '$value.id'
                }
              }
            };
        var self = this;
        CRM.api('BookingResource', 'get', params,
          { context: self,
            success: function(data) {
            var options = data['values']['0']['api.booking_resource_config_set.get']['values']['0']['api.booking_resource_config_option.get']['values'];
            var params = {context:this, list: options, element: "#configSelect", first_option: '- ' + ts('select configuration') + ' -'}
            CRM.BookingApp.vent.trigger("render:options", params);

          }
        });
      }else{
        var params = {context:this, list: new Array(), element: "#configSelect", first_option: '- ' + ts('select configuration') + ' -'}
        CRM.BookingApp.vent.trigger("render:options", params);
        this.$el.find('#configSelect').prop('disabled', true);
      }
    },
    addSubResource: function(e){
     //CRM.BookingApp.modal.close(this);
    }


  });

  AddSubResource.EditAdhocChargesModal = Backbone.Marionette.ItemView.extend({
    template: "#edit-adhoc-charges-template",
    className: "modal-dialog",
    events: {
  },


  });



});
