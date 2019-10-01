export default {
    nodes: {
        'start1' : {
            label: 'Start',
            shape: 'circle'
        },
        'a' : {
            label: 'Enter bank details',
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
            shape: 'circle',
            color: 0xFF0000,
        },
        'f' : {
            label: 'Request bank details',
            color: 0xFF0000,
        },
        'g' : {
            label: 'Receive bank acct details',
            color: 0xFF0000,
        },
        'h' : {
            label: 'Request Payment',
            color: 0xFF0000,
        },
        'end3' : {
            label: 'End',
            shape: 'circle',
            color: 0xFF0000,
        },
        'start4' : {
            label: 'Start',
            shape: 'circle'
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
        'atk' : {
            label: 'ATTACKER',
            color: 0xFF0000,
        },
    },
    edges : [ {
            from : 'start1',
            to : 'a',
        }, {
            from : 'a',
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
            to : 'i',
        }, {
            from : 'i',
            to : 'j',
        }, {
            from : 'j',
            to : 'end4',
        }, {
            from : 'a',
            to : 'c',
            label : "Bank acct details",
            dashes : [10],
        },{
            from : 'a',
            to : 'c',
            label : "Bank acct details",
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
            from : 'j',
            to : 'b',
            label : "Confirmation",
            dashes : [10],
        },{
            from : 'atk',
            to : 'start3',
            label : "Forging tollgate",
            dashes : [10],
        }
    ]
};
