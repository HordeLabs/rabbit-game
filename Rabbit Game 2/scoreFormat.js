window.onload = function getData()
{
	var listRef = new Firebase('https://high-scores.firebaseio.com/Game1Scores');
	listRef = listRef.limit(5);

	listRef.on('child_added', function(snapshot) 
	{

		var msgData = snapshot.val();

  		var node=document.createElement("LI");
		var textNode=document.createTextNode(msgData.Scorer + " scored " + msgData.Score + " on " + msgData.date_time);
		node.appendChild(textNode);
		document.getElementById("scores").appendChild(node);
	});

}