var models = require('../models/models.js');

exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
	 function(quiz){
	   if (quiz) {
	       req.quiz = quiz;
    	       next()
	   }else { next (new Error('No existe quizId=' + quizId)); }
	  }
	).catch(function(error) { next(error);});
};


//GET /quizes
exports.index = function(req, res) {
	  if (req.query.search !== undefined) {
	    var palabra = req.query.search.replace(' ','%');
	    models.Quiz.findAll({ where: ["pregunta like ?", '%' + palabra + '%'], order: 'pregunta ASC' }).then(
	      function(quizes) {
	        res.render('quizes/index', {quizes: quizes, errors: []});
	      }
	    ).catch(function(error) { next(error)});
	  } else {
	    models.Quiz.findAll().then(
	      function(quizes) {
	        res.render('quizes/index.ejs', { quizes: quizes, errors: []});
	      }
	    ).catch(function(error) { next(error);})
	  }
	};

exports.show = function(req, res) {
   res.render('quizes/show', {quiz: req.quiz, errors: []});
};

//GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
       	if (req.query.respuesta === req.quiz.respuesta ) {
	   resultado = 'Correcto';
        }
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

exports.new = function(req,res) {
	var quiz = models.Quiz.build( //Crea el objecto Quiz
	   {pregunta: "Pregunta" , respuesta: "Respuesta"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

exports.create = function(req,res) {
	var quiz = models.Quiz.build( req.body.quiz );
	var errors = quiz.validate();
	if (errors) {
	   var i=0; var errores = new Array();
	   for (var prop in errors) errores[i++] = {message: errors[prop]};
            res.render('quizes/new',{quiz: quiz,errors: err.errors});
	} else {
	   quiz.save({fields:["pregunta","respuesta"]})
           .then( function(){res.render('/quizes')})
        }
};

exports.edit = function(req,res){
	var quiz = req.quiz;
	res.render('quizes/edit', { quiz: quiz, errors: []});
};

exports.update = function(req,res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz
	.validate()
	.then(
	   function(err){
		if (err) {
		 res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		} else {
		 res.quiz
		 .save( {fields: ["pregunta", "respuesta"]})
		 .then( function() { res.redirect('/quizes');});
			}
	    }
	);
};

exports.destroy = function(req,res){
	req.quiz.destroy().then( function() {
	   res.render('quizes');
	}).catch(function(error){next(error)});
};
