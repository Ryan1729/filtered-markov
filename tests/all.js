const fs = require('fs');

eval(fs.readFileSync('./filtered-markov.js')+'')

// assertion framework
const assert = (bool, message) => {
    if (bool) {
        return
    }

    throw new Error(message || "Assertion failed")
}

// test framework
let allTests = []
const it = (test) => allTests.push(test)

// tests
it(() => {
    const input = `A 1
B 2
C 3
`
    const graph = FilteredMarkov.graphFromString(input)

    const samples = {}
    for (var i = 0; i < 100; i += 1) {
        samples[FilteredMarkov.sampleLineFromGraph(graph)] = 1;
    }
    
    const expectedLines = ["A 2", "A 3", "B 1", "B 3", "C 1", "C 2"]
    
    for (const line of expectedLines) {
        assert(samples[line], "line was missing")
    }
})

it(() => {
    const input = `A 1
B 1
C 3
`
    const graph = FilteredMarkov.graphFromString(input)

    const samples = {}
    for (var i = 0; i < 100; i += 1) {
        samples[FilteredMarkov.sampleLineFromGraph(graph)] = 1;
    }
    
    const expectedLines = ["A 3", "B 3", "C 1"]
    
    for (const line of expectedLines) {
        assert(samples[line], "line was missing")
    }
})

// test runner
for (const test of allTests) {
    test()
}
