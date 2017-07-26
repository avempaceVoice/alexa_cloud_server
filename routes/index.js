var express = require('express');
var router = express.Router();
var passport = require('passport');
var lockService = require('../services/lockService')
var list = ['living room', 'arpegio']
var fn = require('../bin/www')
var io = require('socket.io');
var reqhttp = require('request')
var serverUrl = 'https://voiceconnect.ovh/ask'
    /* GET home page. */
router.get('/', securityCheck, function(req, res, next) {
    var tab = []
    fn.clients.forEach(function(soc) {
        tab.push(soc.name)
    })

    res.json({ list: tab })

});

router.post('/unlinkspeaker', function(req, res, next) {
    fn.clients.forEach(function(soc) {
        if (soc.name == req.body.key) {
            console.log('theire is a socket named as requested', soc.name)
            reqhttp.post(serverUrl + '/api/updateSpeakerByNumSerie', { form: { linked: false, num_serie: soc.name } }, function(result) {
                console.log(result)
            })
            soc.linked = false
            var index = fn.lastSelectedClient.indexOf(soc.name)
            fn.lastSelectedClient.splice(index, 1)
            res.end()





        }
    })

})

router.post('/', securityCheck, function(req, res, next) {
    console.log('speaker to link ', req.body.key)
    console.log('length of table socket  ', fn.clients.length)
    ctr = 0
    i = 0
    if (fn.clients.length == 0) {
        res.send('not found')
    } else {
        fn.clients.forEach(function(soc) {
            if (soc.name == req.body.key) {
                console.log('theire is a socket named as requested', soc.name)
                reqhttp.post(serverUrl + '/api/updateSpeakerByNumSerie', { form: { linked: true, num_serie: soc.name } }, function(result) {
                    console.log(result)
                })
                soc.linked = true
                fn.lastSelectedClient.push(soc.name)
                i = 1





            }




            ctr++;
            if (ctr === fn.clients.length) {
                if (i == 0) {
                    res.send('not found')
                } else {
                    return res.send('found')
                }

            }




        })

    }



})


router.post('/checkIfConnected', securityCheck, function(re, res, next) {
    var numSerie = req.body.key;
    var i = 0;
    fn.clients.forEach(function(soc) {

        if (soc.name == numSerie) {
            i = 1
            res.send(true)
        }
    })
    if (i == 0) {
        res.send(false)
    }



})

router.post('/checkIfSelected', securityCheck, function(re, res, next) {
    var numSerie = req.body.key;
    var i = 0;
    fn.clients.forEach(function(soc) {

        if (soc.name == numSerie && soc.linked == true) {
            i = 1
            res.send(true)
        }
    })
    if (i == 0) {
        res.send(false)
    }



})

router.get('/getConnectedDevice', securityCheck, function(req, res, next) {
    var i = 0
    fn.clients.forEach(function(soc) {
        if (soc.linked == true) {
            i = 1
            res.send(soc.name)
        }
    })


    if (i == 0) {
        res.send(false)
    }


})

router.post('/linktoanyone', securityCheck, function(req, res, next) {
    console.log('inside link to any one');
    console.log(req.body.key)
    console.log(fn.clients.length)

    if (fn.clients.length == 0) {
        console.log('inside if pas de client')
        res.send('error')
    } else {
        console.log('inside if theire is a client')
        fn.clients[0].linked = true
        res.send(fn.clients[0].name)
    }




})

router.post('/playnext', securityCheck, function(req, res, next) {
    console.log('req.body.key', req.body.key)

    if (!req.body.key) {


        fn.clients.forEach(function(soc) { // browse all speaker connected




            if (soc.linked == true) {

                fn.sendSocketToSpeaker(soc.name, 'play_next', function(result) {



                    if (result != false) {


                        res.send({ status: 'ok' })
                    } else {

                        res.send({ status: 'no' })
                    }


                })

            }

        })

        res.send({ status: 'no' })




    } else {
        if (fn.clients.length == 0) {
            res.send({ status: 'no' })
        } else {
            fn.sendSocketToSpeaker(req.body.key, 'play_next', function(result) {
                if (result != false) {

                    res.send({ status: 'ok' })
                } else {

                    res.send({ status: 'no' })
                }


            })


        }
    }


})

router.post('/playprevious', securityCheck, function(req, res, next) {
    console.log('req.body.key', req.body.key)
    if (!req.body.key) {


        fn.clients.forEach(function(soc) {


            if (soc.linked == true) {

                fn.sendSocketToSpeaker(soc.name, 'play_prev', function(result) {
                    console.log(result)
                    if (result != false) {
                        res.send({ status: 'ok' })
                        res.end()

                    } else {
                        res.send({ status: 'no' })
                        res.end()
                    }


                })

            }

        })
        res.send({ status: 'no' })

    } else {
        if (fn.clients.length == 0) {
            res.send({ status: 'no' })
        } else {
            fn.sendSocketToSpeaker(req.body.key, 'play_prev', function(result) {
                console.log(result)
                if (result != false) {
                    res.send({ status: 'ok' })
                } else {
                    res.send({ status: 'no' })
                }

            })


        }
    }


})

router.post('/playtrack', securityCheck, function(req, res, next) {
    console.log('req.body.key', req.body.key)
    if (!req.body.key) {


        fn.clients.forEach(function(soc) {


            if (soc.linked == true) {

                fn.sendSocketToSpeaker(soc.name, 'play', function(result) {
                    if (result != false) {
                        res.send({ status: 'ok' })
                    } else {
                        res.send({ status: 'no' })
                    }


                })

            }

        })
        res.send({ status: 'no' })
    } else {
        if (fn.clients.length == 0) {
            res.send({ status: 'no' })
        } else {
            fn.sendSocketToSpeaker(req.body.key, 'play', function(result) {
                if (result != false) {
                    res.send({ status: 'ok' })
                } else {
                    res.send({ status: 'no' })
                }


            })


        }
    }


})

router.post('/increasevolume', securityCheck, function(req, res, next) {
    console.log('req.body.key', req.body.key)
    valtoIncrease = req.body.nb
    if (!req.body.key) {


        fn.clients.forEach(function(soc) {


            if (soc.linked == true) {

                fn.sendSocketToSpeaker(soc.name, 'volume_increase:' + valtoIncrease, function(result) {
                    if (result != false) {
                        res.send({ status: 'ok' })
                    } else {
                        res.send({ status: 'no' })
                    }


                })

            }

        })
        res.send({ status: 'no' })

    } else {
        if (fn.clients.length == 0) {
            res.send({ status: 'no' })
        } else {
            fn.sendSocketToSpeaker(req.body.key, 'volume_increase:' + valtoIncrease, function(result) {
                if (result != false) {
                    res.send({ status: 'ok' })
                } else {
                    res.send({ status: 'no' })
                }


            })


        }
    }


})

router.post('/incrvolume', securityCheck, function(req, res, next) {



    if (!req.body.key) {


        fn.clients.forEach(function(soc) {


            if (soc.linked == true) {

                fn.sendSocketToSpeaker(soc.name, 'volume_increase', function(result) {
                    if (result != false) {
                        res.send({ status: 'ok' })
                    } else {
                        res.send({ status: 'no' })
                    }


                })

            }

        })
        res.send({ status: 'no' })

    } else {



        if (fn.clients.length == 0) {
            res.send({ status: 'no' })
        } else {
            if (fn.clients.length == 0) {
                res.send({ status: 'no' })
            } else {
                fn.sendSocketToSpeaker(req.body.key, 'volume_increase', function(err, result) {
                    console.log(err)
                    if (result != false) {
                        res.send({ status: 'ok' })
                    } else {
                        res.send({ status: 'no' })
                    }


                })
            }
        }



    }


})

router.post('/decreasevolume', securityCheck, function(req, res, next) {
    valtoDecrease = req.body.nb
    console.log('req.body.key', req.body.key)
    if (!req.body.key) {


        fn.clients.forEach(function(soc) {


            if (soc.linked == true) {

                fn.sendSocketToSpeaker(soc.name, 'volume_decrease:' + valtoDecrease, function(result) {
                    if (result != false) {
                        res.send({ status: 'ok' })
                    } else {
                        res.send({ status: 'no' })
                    }


                })

            }

        })
        res.send({ status: 'no' })
    } else {
        if (fn.clients.length == 0) {
            res.send({ status: 'no' })
        } else {
            fn.sendSocketToSpeaker(req.body.key, 'volume_decrease:' + valtoDecrease, function(result) {
                if (result != false) {
                    res.send({ status: 'ok' })
                } else {
                    res.send({ status: 'no' })
                }


            })

        }
    }


})


router.post('/decrevolume', securityCheck, function(req, res, next) {

    console.log('req.body.key', req.body.key)
    if (!req.body.key) {


        fn.clients.forEach(function(soc) {


            if (soc.linked == true) {

                fn.sendSocketToSpeaker(soc.name, 'volume_decrease', function(result) {
                    if (result != false) {
                        res.send({ status: 'ok' })
                    } else {
                        res.send({ status: 'no' })
                    }


                })

            }

        })
        res.send({ status: 'no' })
    } else {
        if (fn.clients.length == 0) {
            res.send({ status: 'no' })
        } else {
            fn.sendSocketToSpeaker(req.body.key, 'volume_decrease', function(result) {
                if (result != false) {
                    res.send({ status: 'ok' })
                } else {
                    res.send({ status: 'no' })
                }


            })
        }

    }


})


router.post('/pause', securityCheck, function(req, res, next) {
    console.log('req.body.key', req.body.key)
    if (!req.body.key) {


        fn.clients.forEach(function(soc) {


            if (soc.linked == true) {

                fn.sendSocketToSpeaker(soc.name, 'pause_toggle', function(result) {
                    if (result != false) {
                        res.send({ status: 'ok' })
                    } else {
                        res.send({ status: 'no' })
                    }


                })

            }

        })
        res.send({ status: 'no' })

    } else {
        if (fn.clients.length == 0) {
            res.send({ status: 'no' })
        } else {
            fn.sendSocketToSpeaker(req.body.key, 'pause_toggle', function(result) {
                if (result != false) {
                    res.send({ status: 'ok' })
                } else {
                    res.send({ status: 'no' })
                }


            })
        }

    }


})




function securityCheck(req, response, next) {

    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;


    if (fullUrl == 'http://www.baidu.com/cache/global/img/gs.gif' || fullUrl == 'http://www.baidu.comhttp://www.baidu.com/cache/global/img/gs.gif') {
        console.log('intrusion try')
        response.end()
    } else {
        next()
    }
}

module.exports = router;