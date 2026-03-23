const express = require('express');
const router = express.Router();
const BookController = require('../controllers/bookController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', BookController.list);
router.post('/', authenticate, authorize('admin'), BookController.add);
router.get('/mes-emprunts', authenticate, BookController.myEmprunts);
router.post('/:id/emprunter', authenticate, BookController.borrow);

module.exports = router;