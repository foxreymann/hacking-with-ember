var messagesRef = new Firebase('https://hatchat.firebaseIO.com/');

var avatarRef = new Firebase('https://hatchat.firebaseIO.com/avatar_list');



App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
    this.route("chat", { path: "/chat" });
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return App.Avatar.create({
        head : App.BodyParts.get('heads').get('firstObject'),
        hat : App.BodyParts.get('hats').get('firstObject'),
        body : App.BodyParts.get('bodys').get('firstObject'),
        leg : App.BodyParts.get('legs').get('firstObject')
    })

  }
});

App.ChatRoute = Ember.Route.extend({
    controllerFor: function() {
        
    }
})

App.Avatar = Ember.Object.extend({
    name : 'test',
    hat: null,
    body : null,
    legs : null,
    publish: function() {
        avatarRef.push({
            userId: this.get('id'),
            hatId: this.get('hat.id'),   
            headId: this.get('head.id'),   
            bodyId: this.get('body.id'),   
            legId: this.get('leg.id'),   
        });
    }
});

App.BodyPart = Ember.Object.extend({
    type : null,
    image: function() {
        return 'images/' + this.get('type') + this.get('id') + '.png';
    }.property('type','id'),

});

App.BodyPartsController = Ember.ArrayController.extend({
    heads: function() {
        return this.get('content').filterProperty('type','head');
    }.property('content'),
    hats: function() {
        return this.get('content').filterProperty('type','hat');
    }.property('content'),
    bodys: function() {
        return this.get('content').filterProperty('type','body');
    }.property('content'),
    legs: function() {
        return this.get('content').filterProperty('type','leg');
    }.property('content'),


});

App.BodyParts = App.BodyPartsController.create({content:[
    App.BodyPart.create({type:'head',id:1}),
    App.BodyPart.create({type:'head',id:2}),
    App.BodyPart.create({type:'head',id:3}),
    App.BodyPart.create({type:'head',id:4}),
    App.BodyPart.create({type:'head',id:5}),
    App.BodyPart.create({type:'head',id:6}),
    App.BodyPart.create({type:'hat',id:1}),
    App.BodyPart.create({type:'hat',id:2}),
    App.BodyPart.create({type:'hat',id:3}),
    App.BodyPart.create({type:'hat',id:4}),
    App.BodyPart.create({type:'hat',id:5}),
    App.BodyPart.create({type:'hat',id:6}),
    App.BodyPart.create({type:'body',id:1}),
    App.BodyPart.create({type:'body',id:2}),
    App.BodyPart.create({type:'body',id:3}),
    App.BodyPart.create({type:'body',id:4}),
    App.BodyPart.create({type:'body',id:5}),
    App.BodyPart.create({type:'body',id:6}),
    App.BodyPart.create({type:'leg',id:1}),
    App.BodyPart.create({type:'leg',id:2}),
    App.BodyPart.create({type:'leg',id:3}),
    App.BodyPart.create({type:'leg',id:4}),
    App.BodyPart.create({type:'leg',id:5}),
    App.BodyPart.create({type:'leg',id:6}),
]})

App.IndexController = Ember.ObjectController.extend({
    next: function(part) {
        var avatar = this.get('model');
        currentHat = avatar.get(part);
        newHatId = (currentHat.get('id')) % 6 + 1;
        avatar.set(part,App.BodyParts.get(part + 's').findProperty('id',newHatId));
    },
    prev: function(part) {
        var avatar = this.get('model');
        currentHat = avatar.get(part);
        newHatId = (currentHat.get('id') -1) % 6;
        if( 0 === newHatId) {
            newHatId = 6; 
        }
        avatar.set(part,App.BodyParts.get(part + 's').findProperty('id',newHatId));
    },
});

App.Messsage = Ember.Object.extend({
    content: null,
    send: function() {
        messagesRef.push({userId: this.get('avatar').get('id') , text:this.get('content')});
    }
});


App.AvatarsController = Ember.ArrayController.extend({
    
});

App.Avatars = App.AvatarsController.create({
    
})

avatarRef.on('child_added', function(snapshot) {
    var msgData = snashot.val();
    App.Avatars.push(App.Avatar.create(msgData));
});
