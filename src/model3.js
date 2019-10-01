export default {
    nodes: {
        'start1' : {
            label: 'Start',
            shape: 'circle',
            border: 0x00FF2A
        },
        'a' : {
            label: 'Enter bank details',
            border: 0x00FF2A
        },
        'add1' : {
            label: 'Provide consent',
            color: 0xFF0000,
            border: 0x00FF2A
        },
        'b' : {
            label: 'Receive info about toll gate payment',
            border: 0x00FF2A
        },
        'details' : {
            label: 'Bank acct details',
            border: 0x00FF2A
        },
        'end1' : {
            label: 'End',
            shape: 'circle',
            border: 0x00FF2A
        },
        'start2' : {
            label: 'Start',
            shape: 'circle',
            border: 0x00FFEA
        },
        'c' : {
            label: 'Stores bank account details',
            border: 0x00FFEA
        },
        'add2' : {
            label: 'Encrypt bank details',
            color: 0xFF0000,
            border: 0x00FFEA,
        },
        'add3' : {
            label: 'P. key',
            border: 0x00FFEA
        },
        'd' : {
            label: 'Bank acct data storage',
            border: 0x00FFEA
        },
        'e' : {
            label: 'Pass toll gate',
            border: 0x00FFEA
        },
        'end2' : {
            label: 'End',
            shape: 'circle',
            border: 0x00FFEA
        },
        'start3' : {
            label: 'Start',
            shape: 'circle',
            border: 0x001FFF
        },
        'add5' : {
            label: 'Recieve consent',
            color: 0xFF0000,
            border: 0x001FFF
        },
        'add6' : {
            label: 'Establish legal ground for payment',
            color: 0xFF0000,
            border: 0x001FFF
        },
        'f' : {
            label: 'Request bank details',
            border: 0x001FFF
        },
        'g' : {
            label: 'Receive bank acct details',
            border: 0x001FFF
        },
        'h' : {
            label: 'Request Payment',
            border: 0x001FFF
        },
        'log' : {
            label: 'Log req payment ops',
            color: 0xFF0000,
            border: 0x001FFF
        },
        'end3' : {
            label: 'End',
            shape: 'circle',
            border: 0x001FFF
        },
        'start4' : {
            label: 'Start',
            shape: 'circle'
        },
        'agree' : {
            label: 'Agree on legal grounds',
            color: 0xFF0000,
        },
        'dec' : {
            label: 'Decrypt bank acct details',
            color: 0xFF0000,
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
            from : 'add3',
            to : 'add2',
            dashes : [10],
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
            to : 'log',
        }, 
        {
            from : 'log',
            to : 'end3',
        },{
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
