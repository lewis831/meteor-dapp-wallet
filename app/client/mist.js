// ADD MIST MENU
updateMistMenu = function(){
    var accounts = Wallets.find({}, {sort: {type: 1, balance: -1, name: 1}}).fetch(),
        balance = 0;

    Meteor.setTimeout(function(){
        var routeName = Router.current() ? Router.current().route.getName() : '';

        // add/update mist menu
        if(typeof mist !== 'undefined') {
            mist.menu.clear();
            mist.menu.add('wallets',{
                position: 1,
                name: TAPi18n.__('wallet.app.buttons.wallet'),
                selected: routeName === 'dashboard'
            }, function(){
                Router.go('/');
            });
            mist.menu.add('send',{
                position: 2,
                name: TAPi18n.__('wallet.app.buttons.send'),
                selected: routeName === 'send' || routeName === 'sendTo'
            }, function(){
                Router.go('/send');
            });

            _.each(accounts, function(account, index){
                mist.menu.add(account._id,{
                    position: 2 + index,
                    name: account.name,
                    badge: EthTools.formatBalance(account.balance, "0 a"),
                    selected: (location.pathname === '/account/'+ account.address)
                }, function(){
                    Router.go('/account/'+ account.address);
                });
            });

            // set total balance in header.js
        }
    }, 10);
};

Tracker.autorun(function(){
    var pendingConfirmation = PendingConfirmations.findOne({operation: {$exists: true}});

    if(typeof mist !== 'undefined' && pendingConfirmation) {
        mist.menu.setBadge(TAPi18n.__('wallet.app.texts.pendingConfirmationsBadge'));
    }

});


Meteor.startup(function() {

    // make reactive
    Tracker.autorun(updateMistMenu);

});