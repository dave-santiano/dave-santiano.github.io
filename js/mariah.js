$(document).ready(function(){
	$.get(
		"https://www.googleapis.com/youtube/v3/videos",{
			part: "statistics",
			id: "yXQViqx6GMY",
			key: "AIzaSyA1HjQvKtwtSoOLP5It9y2eYQQoHPW73Qg"},
			function(data){
				$.each(data.items, function(i,item){
					view_count = item.statistics.viewCount;
					console.log("All I Want For Christmas view count = " + view_count);
				})
			}
	);
});