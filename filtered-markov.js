var FilteredMarkov = (function() {
    "use strict";
    var generate = function(inputString) {
        return generateLines(inputString).join("\n");
    };

    var generateLines = function(inputString) {
        var lines = inputString.split(/\r?\n/);
        
        var bundle = dedupStringArrayAndReturnSet(lines);
        
        var lineSet = bundle.set;
        var linesWithoutDuplicates = bundle.array;
        
        var graph = getGraphFromTokens(getAllTokensFromLines(linesWithoutDuplicates));
        
        var resultLines = graphToLines(graph, lineSet);
        
        return resultLines;
    }

    var graphToString = function(graph, linesSet) {
        return graphToLines(graph, linesSet).join("\n");
    };
    
    var graphFromString = function(inputString) {
        var lines = inputString.split(/\r?\n/);
        return generateGraph(lines);
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
        var bundle = dedupStringArrayAndReturnSet(lines);
        return getGraphFromTokens(getAllTokensFromLines(bundle.array));
    };
    
    var sampleLineFromGraph = function(graph, randomFloat01) {
        if (!randomFloat01) {
            randomFloat01 = Math.random
        }
        return sampleLineFromGraphHelper(graph, randomFloat01, "")
    }
    
    var sampleLineFromGraphHelper = function (graph, randomFloat01, prefix) {
        if (!graph || graph.length <= 0) {
            return prefix;
        }
        
        var child = graph[Math.floor(randomFloat01() * graph.length)];
        
        var newPrefix = prefix 
            ?   prefix + " " + child.value
            :   child.value;
        
        
        return sampleLineFromGraphHelper(child.children, randomFloat01, newPrefix)
    }
    
    var getAllTokensFromLines = function (lines) {
        var allTokens = [];
        
        for (var i = 0; i < lines.length; i += 1) {
            var line = lines[i];
            
            var tokens = line.split(" ").filter(function (token){
                return token.length > 0;
            });
            
            addTokens(allTokens, tokens);
        }
        
        return allTokens.map(dedupStringArray);
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
    
    var dedupStringArray = function (array) {
        return dedupStringArrayAndReturnSet(array).array
    };
    
    var dedupStringArrayAndReturnSet = function (array) {
        var set = array.reduce(function (acc, str) {
                    acc[str] = true;
                    return acc;
                }, {});
        
        
        var filteredArray = [];
        for (var str in set) {
            if (!set.hasOwnProperty(str)) {
                continue;
            }
            
            filteredArray.push(str);
        }
        
        return {
            array: filteredArray,
            set: set
        }
    }
    
    return {
        generate: generate,
        generateLines: generateLines,
        graphToString: graphToString,
        graphFromString: graphFromString,
        graphToLines: graphToLines,
        generateGraph: generateGraph,
        getGraphFromTokens: getGraphFromTokens,
        getAllTokensFromLines: getAllTokensFromLines,
        dedupStringArrayAndReturnSet: dedupStringArrayAndReturnSet,
        sampleLineFromGraph: sampleLineFromGraph,
    }
}())