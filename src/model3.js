export default {
    nodes: {
        'start1' : {
            label: 'Start',
            shape: 'circle'
        },
        'a' : {
            label: 'Enter bank details',
        },
        'add1' : {
            label: 'Provide consent',
            border: 0xFF0000,
        },
        'b' : {
            label: 'Receive info about toll gate payment'

        },
        'details' : {
            label: 'Bank acct details'
        },
        'end1' : {
            label: 'End',
            shape: 'circle'
        },
        'start2' : {
            label: 'Start',
            shape: 'circle'
        },
        'c' : {
            label: 'Stores bank account details'

        },
        'add2' : {
            label: 'Encrypt bank details',
            border: 0xFF0000,
        },
        'add3' : {
            label: 'P. key'
        },
        'add4' : {
            label: 'Encrypted details'
        },
        'd' : {
            label: 'Bank acct data storage'
        },
        'e' : {
            label: 'Pass toll gate'
        },
        'end2' : {
            label: 'End',
            shape: 'circle'
        },
        'start3' : {
            label: 'Start',
            shape: 'circle'
        },
        'add5' : {
            label: 'Recieve consent',
            border: 0xFF0000,
        },
        'add6' : {
            label: 'Establish legal ground for payment',
            border: 0xFF0000,
        },
        'f' : {
            label: 'Request bank details'
        },
        'g' : {
            label: 'Receive bank acct details'
        },
        'h' : {
            label: 'Request Payment'
        },
        'log' : {
            label: 'Log req payment ops',
            border: 0xFF0000,
        },
        'end3' : {
            label: 'End',
            shape: 'circle'
        },
        'start4' : {
            label: 'Start',
            shape: 'circle'
        },
        'agree' : {
            label: 'Agree on legal grounds',
            border: 0xFF0000,
        },
        'dec' : {
            label: 'Decrypt bank acct details',
            border: 0xFF0000,
        },
        'key2' : {
            label: 'P. key'
        },
        'i' : {
            label: 'Perform payment transaction'
        },
        'j' : {
            label: 'Inform about transaction'
        },
        'end4' : {
            label: 'End',
            shape: 'circle'
        },
    },
    edges : [ {
            from : 'start1',
            to : 'a',
        }, {
            from : 'a',
            to : 'add1',
        }, {
            from : 'add1',
            to : 'b',
        }, {
           from : 'details',
           to : 'a',
           dashes : [10],
        }, {
            from : 'b',
            to : 'end1',
        }, {
            from : 'start2',
            to : 'add2',
        }, {
            from : 'add2',
            to : 'c',
        }, {
            from : 'c', 
            to : 'e',
        }, {
            from : 'c',
            to : 'd',
            dashes : [10],
        }, {
            from : 'd',
            to : 'e',
            dashes : [10],
        }, {
            from : 'e',
            to : 'end2',
        }, {
            from : 'start3',
            to : 'f',
        }, {
            from : 'f',
            to : 'g',
        }, {
            from : 'g',
            to : 'h',
        }, {
            from : 'h',
            to : 'end3',
        }, {
            from : 'start4',
            to : 'agree',
        }, {
            from : 'agree',
            to : 'dec',
        }, {
            from : 'dec',
            to : 'i',
        }, {
            from : 'a',
            to : 'add1',
        }, {
            from : 'key2',
            to : 'dec',
            dashes : [10],
        }, {
            from : 'j',
            to : 'end4',
        }, {
            from : 'a',
            to : 'add2',
            label : "Encryptred bank acct details",
            dashes : [10],
        }, {
            from : 'add1',
            to : 'add5',
            label : "confirmation",
            dashes : [10],
        },{
            from : 'e',
            to : 'g',
            label : "Bank acct details",
            dashes : [10],
        },{
            from : 'f',
            to : 'e',
            label : "Request for bank details",
            dashes : [10],
        },{
            from : 'h',
            to : 'i',
            label : "Bank acct details",
            dashes : [10],
        },{
            from : 'add5',
            to : 'i',
            label : "Bank acct details",
            dashes : [10],
        }, {
            from : 'add6',
            to : 'agree',
            label : "Consent to process abk details",
            dashes : [10],
        }, {
            from : 'j',
            to : 'b',
            label : "Confirmation",
            dashes : [10],
        }
    ]
};
