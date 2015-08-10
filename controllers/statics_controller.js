var models = require ('../models/models.js');



exports.load=function(req, res) {

var nQuizes=0;
var nComments = 0;

	models.Quiz.count().then(function (nQuizes){

		models.Comment.count().then(function (nComments){

				var mediaComments= nComments / nQuizes;

				models.Quiz.findAll({
					include:[{model: models.Comment}]
				}).then(function (quizes){

					var preguntasCon = 0;
					for (i in quizes){
					if (quizes[i].Comments.length)
						preguntasCon++;
					}

				var preguntasSin = nQuizes - preguntasCon;

		res.render('statics', {quizes: nQuizes,
 						comments:nComments,
 						commentsMedia: mediaComments,
 						pregC: preguntasCon,
 						pregS: preguntasSin,
 						errors: [] 
		});

	})

	})	
});



}

