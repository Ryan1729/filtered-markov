var FilteredMarkov = (function() {
    "use strict";
    var generate = function(inputString) {
        var lines = inputString.split(/\r?\n/);
        
        var graph = generateGraph(lines);
        
        var resultString = graphToString(graph);
        
        return resultString;
    };
    
    var graphToString = function(graph, lines) {
        var resultLines = [];
        
        graphToStringHelper(graph, "", resultLines);
        
        var linesSet = lines 
            ?   lines.reduce(function (acc, line) {
                    acc[line] = true;
                    return acc;
                }, {})
            :   {};
        
        return resultLines.filter(function(line) {
            return !linesSet[line];
        }).join("\n");
    };
    
    var graphToStringHelper = function (graph, prefix, result) {
        if (!graph || graph.length <= 0) {
            result.push(prefix);
            return;
        }
        
        for (var i = 0; i < graph.length; i += 1) {
            var child = graph[i];
            
            graphToStringHelper(child.children, prefix + child.value, result)
        }
    }
    
    var generateGraph = function(lines) {
        var graph = [];
        
        return graph;
    };
    
    return {
        generate: generate,
        graphToString, graphToString,
        generateGraph: generateGraph,
    }
}())