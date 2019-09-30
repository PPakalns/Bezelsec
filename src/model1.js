export default {
    nodes: {
        'start1' : {
            label: 'Start'
        },
        'a' : {
            label: 'Enter bank details'
        },
        'b' : {
            label: 'Receive info about toll gate payment'

        },
        'details' : {
            label: 'Bank acct details'
        },
        'end1' : {
            label: 'End'
        },
        'start2' : {
            label: 'Start'
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
            label: 'End'
        },
        'start3' : {
            label: 'Start'
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
        'end3' : {
            label: 'Pass toll gate'
        },
        'start4' : {
            label: 'Start'
        },
        'i' : {
            label: 'Perform payment transaction'
        },
        'j' : {
            label: 'Inform about transaction'
        },
        'end4' : {
            label: 'End'
        },
    },
    edges : [ {
            from : 'start1',
            to : 'a',
            label : "Test label",
            dashes : [10],
        }, {
            from : 'a',
            to : 'b',
            label : "Ayy lmao",
        }, {
           from : 'details',
           to : 'a',
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
        }, {
            from : 'd',
            to : 'e',
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
        }
    ]
};