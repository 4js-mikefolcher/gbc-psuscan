"use strict";

/**
 * @readonly
 * @enum {string};
 */
gbc.constants.loadingAnimations = {
  default: { style: 'default', divCount: 0 },
  ring: { style: 'lds-ring', divCount: 4 },
  roller: { style: 'lds-roller', divCount: 8 },
  ellipsis: { style: 'lds-ellipsis', divCount: 4 },
  spinner: { style: 'lds-spinner', divCount: 12 },
  grid: { style: 'lds-grid', divCount: 9 }
};
gbc.constants.activeAnimation = gbc.constants.loadingAnimations.ellipsis;
