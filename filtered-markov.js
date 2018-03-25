var FilteredMarkov = (function() {
    "use strict";
    var generate = function(inputString) {
        return generateLines(inputString).join("\n");
    };
    
    var generateLines = function(inputString) {
        var lines = inputString.split(/\r?\n/);
        
        var lineSet = lines.reduce(function (acc, line) {
                    acc[line] = true;
                    return acc;
                }, {});
        
        
        var linesWithoutDuplicates = [];
        for (var line in lineSet) {
            if (!lineSet.hasOwnProperty(line)) {
                continue;
            }
            
            linesWithoutDuplicates.push(line);
        }
        
        var graph = generateGraph(linesWithoutDuplicates);
        
        var resultLines = graphToLines(graph, lineSet);
        
        return resultLines;
    }
    
    var graphToString = function(graph, linesSet) {
        return graphToLines(graph, linesSet).join("\n");
    };
    
    var graphToLines = function(graph, linesSet) {
        var resultLines = [];
        
        graphToLinesHelper(graph, "", resultLines);
        
        return resultLines.filter(function(line) {
            return !linesSet[line];
        });
    }
    
    var graphToLinesHelper = function (graph, prefix, result) {
        if (!graph || graph.length <= 0) {
            result.push(prefix);
            return;
        }
        
        for (var i = 0; i < graph.length; i += 1) {
            var child = graph[i];
            
            var newPrefix = prefix 
                ?   prefix + " " + child.value
                :   child.value;
            
            
            graphToLinesHelper(child.children, newPrefix, result)
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
        generateLines: generateLines,
        graphToString, graphToString,
        graphToLines, graphToLines,
        generateGraph: generateGraph,
        getGraphFromTokens: getGraphFromTokens,
        getAllTokensFromLines: getAllTokensFromLines,
    }
}())