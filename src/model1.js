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
    edges : [
        ['start1', 'a'],
        ['a', 'b'],
        ['details', 'a'],
        ['b', 'end1'],
        ['start2', 'c'],
        ['c', 'e'],
        ['c', 'd'],
        ['d', 'e'],
        ['e', 'end2'],
        ['start3', 'f'],
        ['f', 'g'],
        ['g', 'h'],
        ['h', 'end3'],
        ['start4', 'i'],
        ['i', 'j'],
        ['j', 'end4'],
    ]
};