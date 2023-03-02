'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/transfer', controller.home.transfer);
  router.get('/getTransferStaus', controller.home.getTransferStatus);
};
