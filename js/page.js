document.addEventListener("DOMContentLoaded", function(){
			var thumbs  = document.getElementsByClassName("hoverimg");
			console.log(thumbs);
			for(var i=0;i<thumbs.length; i++){
				thumbs[i].addEventListener("mouseenter", function(e){
					var el = e.target;
					var ats = el.dataset.animation;
					var hideNowShow = document.querySelector("."+ats);
					hideNowShow.classList.remove("hide");
				})

				thumbs[i].addEventListener("mouseleave", function(e){
					var el = e.target;
					var ats = el.dataset.animation;
					var hideNowShow = document.querySelector("."+ats);
					hideNowShow.classList.add("hide");
				})
			}
		})