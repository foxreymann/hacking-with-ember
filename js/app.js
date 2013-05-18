App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return App.Avatar.create({head : App.HeadsController.get('firstObject')})

  }
});

App.Avatar = Ember.Object.extend({
    name : 'test',
    hat: null,
    body : null,
    legs : null


});

App.BodyPart = Ember.Object.extend({
    type : null,
    image: function() {
        return 'images/' + this.get('type') + this.get('id') + '.png';
    }.property('type','id'),

});

App.HeadsController = Ember.ArrayController.create({
    content: [App.BodyPart.create({type:'head',id:1})]


});
