//TODO don't put duplicate nodes in the tgf if two 
//edges are to the same object in memory.
var valueAndChildrenToTGF = function (graph) {
    var nodes = [];
    var edges = [];
    
    valueAndChildrenToTGFHelper(
        graph,
        nodes,
        edges,
        0
    );
    
    //remove spurious extra edge to non-existent node
    edges.length = edges.length - 1;
    
    var result = "";
    
    for (var i = 0; i < nodes.length; i += 1) {
        result += i;
        result += " ";
        result += nodes[i];
        result += "\n";
    }
    
    result += "#\n";
    
    for (var i = 0; i < edges.length; i += 1) {
        var edge = edges[i];
        
        result += edge[0];
        result += " ";
        result += edge[1];
        result += "\n";
    }
    
    return result;
}

var valueAndChildrenToTGFHelper = function(
    graph,
    nodes,
    edges,
    parentId
) {
    if (!graph || graph.length <= 0) {
        return;
    }
    

    for (var i = 0; i < graph.length; i += 1) {
        var child = graph[i];
        
        nodes.push(child.value);
        
        var currentId = nodes.length;
        
        edges.push([parentId, currentId]);
        
        valueAndChildrenToTGFHelper(child.children, nodes, edges, currentId);
    }
}