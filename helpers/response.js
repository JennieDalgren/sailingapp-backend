const response = {

  data: function(req, res, data) {
    res.status(200).json(data);
  },

  ok: function(req, res) {
    res.status(200).json({});
  },

  forbidden: function(req, res, err) {
    res.status(403).json({
      error: err || 'Forbidden'
    });
  },

  notFound: function(req, res, err) {
    res.status(404).json({
      error: err || 'Not found'
    });
  },

  unprocessable: function(req, res, err) {
    res.status(422).json({
      error: err || 'Unprocessable'
    });
  },

  unexpectedError: function(req, res, err) {
    console.log(req.method, req.path, err);
    res.status(500).json({
      error: 'Unexpected error'
    });
  }
};

module.exports = response;
