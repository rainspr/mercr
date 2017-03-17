
riot.tag2('app', '<nav class="navbar navbar-default"> <div class="container-fluid"> <div class="navbar-header"> <button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="#">Riot Sample</a> </div> <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"> <ul class="nav navbar-nav"> <li><a href="#">home</a></li> <li><a href="#pray">pray</a></li> <li><a href="#gp">gp</a></li> </ul> </div> </div> </nav> <div class="container-fluid"> <div id="content"> <h1>test</h1> </div> </div>', '', '', function(opts) {
    var r = route.create()
    r('', function () {
      riot.mount('#content', 'home')
    })
    r('pray', function () {
      riot.mount('#content', 'pray')
    })
    r('gp', function () {
      riot.mount('#content', 'gp')
    })
    r(function () {
      riot.mount('#content', 'home')
    })

    //let rt = route.create()
    //rt(activatetab)

});
riot.tag2('home', '<h1>home</h1>', '', '', function(opts) {
});

riot.tag2('gp', '<h1>testg</h1>', '', '', function(opts) {
});

riot.tag2('pray', '<p>testp</p>', '', '', function(opts) {
});