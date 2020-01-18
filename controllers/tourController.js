const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query, 'dadasd');
    const queryFields = { ...req.query };
    const excludeFields = ['sort', 'limit', 'page'];
    excludeFields.forEach(el => delete queryFields[el]);

    console.log(excludeFields, queryFields);

    const tours = await Tour.find(queryFields);

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: 'Not Found',
      err: err
    });
  }
};

exports.getTour = async (req, res) => {
  console.log(req.params);

  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (er) {
    res.status(400).json({
      status: 'failed',
      data: {
        er
      }
    });
  }

  // const tour = tours.find(el => el.id === id);

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour
  //   }
  // });
};

exports.createTour = async (req, res) => {
  console.log(req.body);
  // const newTour = Object.assign({ id: newId }, req.body);

  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Something Went Wrong'
    });
  }

  // tours.push(newTour);

  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   err => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tour: newTour
  //       }
  //     });
  //   }
  // );
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(401).json({
      status: 'success',
      error: error
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(204).json({
      status: 'success',
      data: error
    });
  }
};
