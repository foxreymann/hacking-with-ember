var avatarRef = new Firebase('https://hatchat.firebaseIO.com/avatar_list');

var messagesList = new Firebase('https://hatchat.firebaseIO.com/message_list');



App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
    this.route("chat", { path: "/chat" });
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    var userId = Math.floor(Math.random() * 999999);
    return App.Avatar.create({
        id : userId,
        headId : 1,
        hatId : 1,
        bodyId : 1,
        legId : 1
    })

  }
});

App.ChatRoute = Ember.Route.extend({
    controllerFor: function() {
        return App.Avatars;        
    },
    setupController: function(controller) {
     controller.set('content', []);
    }
})

App.Avatar = Ember.Object.extend({
    name : 'test',
    hat: function() {
        return App.BodyParts.get('hats').findProperty('id',this.get('hatId'));
    }.property('hatId'),
    head: function() {
        return App.BodyParts.get('heads').findProperty('id',this.get('headId'));
    }.property('headId'),
    body: function() {
        return App.BodyParts.get('bodys').findProperty('id',this.get('bodyId'));
    }.property('bodyId'),
    leg: function() {
        return App.BodyParts.get('legs').findProperty('id',this.get('legId'));
    }.property('legId'),
    publish: function() {
        avatarRef.push({
            id: this.get('id'),
            hatId: this.get('hatId'),   
            headId: this.get('headId'),   
            bodyId: this.get('bodyId'),   
            legId: this.get('legId'),   
        });
        App.Router.router.transitionTo('chat');
        App.set('currentAvatar',this);
    },
    message: function() {
        return App.Messages.filterProperty('userId',this.get('id')).get('lastObject');
    
    }.property('App.Messages.@each')
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
    App.BodyPart.create({type:'head',id:4}),
    App.BodyPart.create({type:'hat',id:1}),
    App.BodyPart.create({type:'hat',id:2}),
    App.BodyPart.create({type:'hat',id:3}),
    App.BodyPart.create({type:'hat',id:4}),
    App.BodyPart.create({type:'hat',id:5}),
    App.BodyPart.create({type:'hat',id:4}),
    App.BodyPart.create({type:'body',id:1}),
    App.BodyPart.create({type:'body',id:2}),
    App.BodyPart.create({type:'body',id:3}),
    App.BodyPart.create({type:'body',id:4}),
    App.BodyPart.create({type:'body',id:5}),
    App.BodyPart.create({type:'body',id:4}),
    App.BodyPart.create({type:'leg',id:1}),
    App.BodyPart.create({type:'leg',id:2}),
    App.BodyPart.create({type:'leg',id:3}),
    App.BodyPart.create({type:'leg',id:4}),
    App.BodyPart.create({type:'leg',id:5}),
    App.BodyPart.create({type:'leg',id:4}),
]})

App.IndexController = Ember.ObjectController.extend({
    next: function(part) {
        var avatar = this.get('model');
        currentHat = avatar.get(part);
        newHatId = (currentHat.get('id')) % 4 + 1;
        avatar.set(part + 'Id', newHatId);
    },
    prev: function(part) {
        var avatar = this.get('model');
        currentHat = avatar.get(part);
        newHatId = (currentHat.get('id') -1) % 4;
        if( 0 === newHatId) {
            newHatId = 4;
        }
        avatar.set(part + 'Id', newHatId);
    },
});

App.Message = Ember.Object.extend({
    content: null,
    send: function() {
        messagesList.push({userId: App.get('currentAvatar').get('id') , content:this.get('content')});
    }
});


App.AvatarsController = Ember.ArrayController.extend({
    publish : function() {
        console.log('sending a mes');
        
    },
    messageChanged : function() {
           console.log(this.get('newMessage'));

    }.observes('newMessage') 
});

App.Avatars = App.AvatarsController.create({
})

avatarRef.on('child_added', function(snapshot) {
    var msgData = snapshot.val();
    App.Avatars.pushObject(App.Avatar.create(msgData));
});

messagesList.on('child_added', function(snapshot) {
    var msgData = snapshot.val();
    App.Messages.pushObject(App.Message.create(msgData));
});


App.ChatController = Ember.Controller.extend({
    publish : function() {
        App.Message.create({content : this.get('newMessage')}).send();
    }
});

App.MessagesController = Ember.ArrayController.extend({
    

})

App.Messages = App.MessagesController.create({
    

})
