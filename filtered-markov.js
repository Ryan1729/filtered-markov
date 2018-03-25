var FilteredMarkov = (function() {
    "use strict";
    var generate = function(inputString) {
        var lines = inputString.split(/\r?\n/);
        
        var graph = generateGraph(lines);
        
        var resultString = graphToString(graph, lines);
        
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
            
            var newPrefix = prefix 
                ?   prefix + " " + child.value
                :   child.value;
            
            
            graphToStringHelper(child.children, newPrefix, result)
        }
    }
    
    var generateGraph = function(lines) {
        return getGraphFromTokens(getAllTokensFromLines(lines));
    };
    
    var getAllTokensFromLines = function (lines) {
        var allTokens = [];
        
        for (var i = 0; i < lines.length; i += 1) {
            var line = lines[i];
            
            var tokens = line.split(" ").filter(function (token){
                return token.length > 0;
            });
            
            addTokens(allTokens, tokens);
        }
        
        return allTokens;
    }
    
    var getGraphFromTokens = function (tokens) {
        var graph = undefined;
        for (var i = tokens.length - 1; i >= 0; i -= 1) {
            var currentTokens = tokens[i];
            graph = currentTokens.map(function (currentToken){
                return {
                    value: currentToken,
                    children: graph
                };
            });
        }
        
        return graph;
    }
    
    var addTokens = function (allTokens, newTokens) {
        for (var i = 0; i < newTokens.length; i += 1) {
            if (!allTokens[i]) {
                allTokens[i] = [];
            }
            
            allTokens[i].push(newTokens[i]);
        }
    }
    
    return {
        generate: generate,
        graphToString, graphToString,
        generateGraph: generateGraph,
        getGraphFromTokens: getGraphFromTokens,
        getAllTokensFromLines: getAllTokensFromLines,
    }
}())