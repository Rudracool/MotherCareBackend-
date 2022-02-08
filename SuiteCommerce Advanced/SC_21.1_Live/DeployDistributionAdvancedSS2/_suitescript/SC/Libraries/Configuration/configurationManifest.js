define(["exports"], function (exports) {
			"use strict";
			Object.defineProperty(exports, "__esModule", { value: true });
			function configurationManifest() {
				return {
	"addresses": {
		"isPhoneMandatory": true
	},
	"layout": {
		"colorPalette": [
			{
				"paletteId": "default",
				"colorName": "black",
				"colorValue": "#212121"
			},
			{
				"paletteId": "default",
				"colorName": "gray",
				"colorValue": "#9c9c9c"
			},
			{
				"paletteId": "default",
				"colorName": "grey",
				"colorValue": "#9c9c9c"
			},
			{
				"paletteId": "default",
				"colorName": "white",
				"colorValue": "#fff"
			},
			{
				"paletteId": "default",
				"colorName": "brown",
				"colorValue": "#804d3b"
			},
			{
				"paletteId": "default",
				"colorName": "beige",
				"colorValue": "#eedcbe"
			},
			{
				"paletteId": "default",
				"colorName": "blue",
				"colorValue": "#0f5da3"
			},
			{
				"paletteId": "default",
				"colorName": "light-blue",
				"colorValue": "#8fdeec"
			},
			{
				"paletteId": "default",
				"colorName": "purple",
				"colorValue": "#9b4a97"
			},
			{
				"paletteId": "default",
				"colorName": "lilac",
				"colorValue": "#ceadd0"
			},
			{
				"paletteId": "default",
				"colorName": "red",
				"colorValue": "#f63440"
			},
			{
				"paletteId": "default",
				"colorName": "pink",
				"colorValue": "#ffa5c1"
			},
			{
				"paletteId": "default",
				"colorName": "orange",
				"colorValue": "#ff5200"
			},
			{
				"paletteId": "default",
				"colorName": "peach",
				"colorValue": "#ffcc8c"
			},
			{
				"paletteId": "default",
				"colorName": "yellow",
				"colorValue": "#ffde00"
			},
			{
				"paletteId": "default",
				"colorName": "light-yellow",
				"colorValue": "#ffee7a"
			},
			{
				"paletteId": "default",
				"colorName": "green",
				"colorValue": "#00af43"
			},
			{
				"paletteId": "default",
				"colorName": "lime",
				"colorValue": "#c3d600"
			},
			{
				"paletteId": "default",
				"colorName": "teal",
				"colorValue": "#00ab95"
			},
			{
				"paletteId": "default",
				"colorName": "aqua",
				"colorValue": "#28e1c5"
			},
			{
				"paletteId": "default",
				"colorName": "burgandy",
				"colorValue": "#9c0633"
			},
			{
				"paletteId": "default",
				"colorName": "navy",
				"colorValue": "#002d5d"
			}
		],
		"lightColors": [
			"white"
		]
	},
	"imageNotAvailable": "",
	"imageSizeMapping": [
		{
			"id": "thumbnail",
			"value": "thumbnail"
		},
		{
			"id": "main",
			"value": "main"
		},
		{
			"id": "tinythumb",
			"value": "tinythumb"
		},
		{
			"id": "zoom",
			"value": "zoom"
		},
		{
			"id": "fullscreen",
			"value": "fullscreen"
		},
		{
			"id": "homeslider",
			"value": "homeslider"
		},
		{
			"id": "homecell",
			"value": "homecell"
		}
	],
	"addToCartBehavior": "showCartConfirmationModal",
	"addToCartFromFacetsView": false,
	"promocodes": {
		"allowMultiples": false
	},
	"matrixchilditems": {
		"enabled": false,
		"fieldset": "matrixchilditems_search"
	},
	"showTaxDetailsPerLine": false,
	"isZoomEnabled": true,
	"summaryTaxLabel": "Tax",
	"priceLevel": {
		"enabled": true,
		"default": "pricelevel1"
	},
	"categories": {
		"menuLevel": 3,
		"addToNavigationTabs": true,
		"excludeEmptyCategories": false,
		"sideMenu": {
			"sortBy": "sequencenumber",
			"additionalFields": [],
			"uncollapsible": false,
			"showMax": 5,
			"collapsed": false
		},
		"subCategories": {
			"sortBy": "sequencenumber",
			"fields": []
		},
		"category": {
			"fields": []
		},
		"breadcrumb": {
			"fields": []
		},
		"menu": {
			"sortBy": "sequencenumber",
			"fields": []
		}
	},
	"creditCard": {
		"showCreditCardHelp": true,
		"creditCardHelpTitle": "Enter the 3- or 4-digit Card Security Code. The placement of this number depends on the credit card provider, as shown below.",
		"imageCvvAllCards": "",
		"imageCvvAmericanCard": "",
		"creditCardShowSecureInfo": "<p class=\"order-wizard-paymentmethod-creditcard-secure-info\">We take all reasonable steps to protect our customers personal information against loss, misuse and alteration. We use encryption technology whenever receiving and transferring your personal information on our site. <strong>When you are viewing a page that is requesting personal information, the URL in the address bar at top of your browser will start with \"https\". </strong> This indicates your transaction session is secured through Secure Sockets Layer (SSL). If the web page you are viewing does not start with \"https\", please contact us.</p>"
	},
	"customFields": {
		"salesorder": []
	},
	"facetsAsUrlParameters": false,
	"facets": [
		{
			"id": "pricelevel5",
			"name": "Price",
			"priority": 10,
			"behavior": "range",
			"template": "facets_faceted_navigation_item_range.tpl",
			"uncollapsible": true,
			"titleToken": "Price $(1) - $(0)",
			"titleSeparator": ", ",
			"parser": "currency",
			"isParameter": true,
			"max": 4
		}
	],
	"facetDelimiters": {
		"betweenFacetNameAndValue": "/",
		"betweenDifferentFacets": "/",
		"betweenDifferentFacetsValues": ",",
		"betweenRangeFacetsValues": "to",
		"betweenFacetsAndOptions": "?",
		"betweenOptionNameAndValue": "=",
		"betweenDifferentOptions": "&"
	},
	"facetsSeoLimits": {
		"numberOfFacetsGroups": 2,
		"numberOfFacetsValues": 2,
		"options": [
			"page",
			"keywords"
		]
	},
	"itemsDisplayOptions": [
		{
			"id": "list",
			"name": "List",
			"template": "facets_item_cell_list.tpl",
			"columns": 1,
			"icon": "icon-display-list"
		},
		{
			"id": "table",
			"name": "Table",
			"template": "facets_item_cell_table.tpl",
			"columns": 2,
			"icon": "icon-display-table"
		},
		{
			"id": "grid",
			"name": "Grid",
			"template": "facets_item_cell_grid.tpl",
			"columns": 4,
			"icon": "icon-display-grid",
			"isDefault": true
		}
	],
	"itemsDisplayOptionsPhone": [
		{
			"id": "list",
			"name": "List",
			"template": "facets_item_cell_list.tpl",
			"columns": 1,
			"icon": "icon-display-list"
		},
		{
			"id": "table",
			"name": "Table",
			"template": "facets_item_cell_table.tpl",
			"columns": 2,
			"icon": "icon-display-table",
			"isDefault": true
		}
	],
	"itemsDisplayOptionsTablet": [
		{
			"id": "list",
			"name": "List",
			"template": "facets_item_cell_list.tpl",
			"columns": 1,
			"icon": "icon-display-list"
		},
		{
			"id": "table",
			"name": "Table",
			"template": "facets_item_cell_table.tpl",
			"columns": 2,
			"icon": "icon-display-table"
		},
		{
			"id": "grid",
			"name": "Grid",
			"template": "facets_item_cell_grid.tpl",
			"columns": 4,
			"icon": "icon-display-grid",
			"isDefault": true
		}
	],
	"defaultSearchTitle": "Products",
	"searchPrefs": {
		"maxLength": 40
	},
	"resultsPerPage": [
		{
			"items": 12,
			"name": "$(0) per page"
		},
		{
			"items": 24,
			"name": "$(0) per page",
			"isDefault": true
		},
		{
			"items": 48,
			"name": "$(0) per page"
		}
	],
	"sortOptions": [
		{
			"id": "relevance:desc",
			"name": "Relevance",
			"isDefault": true
		},
		{
			"id": "onlinecustomerprice:asc",
			"name": "Price, low to high",
			"isDefault": false
		},
		{
			"id": "onlinecustomerprice:desc",
			"name": "Price, high to low",
			"isDefault": false
		}
	],
	"sortOptionsPhone": [
		{
			"id": "relevance:desc",
			"name": "Sort by relevance",
			"isDefault": true
		},
		{
			"id": "onlinecustomerprice:asc",
			"name": "Sort by price, low to high",
			"isDefault": false
		},
		{
			"id": "onlinecustomerprice:desc",
			"name": "Sort by price, high to low",
			"isDefault": false
		}
	],
	"sortOptionsTablet": [
		{
			"id": "relevance:desc",
			"name": "Sort by relevance",
			"isDefault": true
		},
		{
			"id": "onlinecustomerprice:asc",
			"name": "Sort by price, low to high",
			"isDefault": false
		},
		{
			"id": "onlinecustomerprice:desc",
			"name": "Sort by price, high to low",
			"isDefault": false
		}
	],
	"ItemOptions": {
		"showOnlyTheListedOptions": false,
		"optionsConfiguration": [
			{
				"cartOptionId": "custcol13",
				"label": "Color",
				"urlParameterName": "color",
				"colors": "default",
				"index": 10,
				"templateSelector": "product_views_option_color.tpl",
				"showSelectorInList": false,
				"templateFacetCell": "product_views_option_facets_color.tpl",
				"templateSelected": "transaction_line_views_selected_option_color.tpl"
			},
			{
				"cartOptionId": "GIFTCERTFROM",
				"urlParameterName": "from",
				"label": "From"
			},
			{
				"cartOptionId": "GIFTCERTRECIPIENTNAME",
				"urlParameterName": "to",
				"label": "To"
			},
			{
				"cartOptionId": "GIFTCERTRECIPIENTEMAIL",
				"urlParameterName": "to-email",
				"label": "To email"
			},
			{
				"cartOptionId": "GIFTCERTMESSAGE",
				"urlParameterName": "message",
				"label": "Message"
			}
		],
		"defaultTemplates": {
			"selectorByType": [
				{
					"type": "select",
					"template": "product_views_option_tile.tpl"
				},
				{
					"type": "date",
					"template": "product_views_option_date.tpl"
				},
				{
					"type": "email",
					"template": "product_views_option_email.tpl"
				},
				{
					"type": "url",
					"template": "product_views_option_url.tpl"
				},
				{
					"type": "password",
					"template": "product_views_option_password.tpl"
				},
				{
					"type": "float",
					"template": "product_views_option_float.tpl"
				},
				{
					"type": "integer",
					"template": "product_views_option_integer.tpl"
				},
				{
					"type": "datetimetz",
					"template": "product_views_option_datetimetz.tpl"
				},
				{
					"type": "percent",
					"template": "product_views_option_percent.tpl"
				},
				{
					"type": "currency",
					"template": "product_views_option_currency.tpl"
				},
				{
					"type": "textarea",
					"template": "product_views_option_textarea.tpl"
				},
				{
					"type": "phone",
					"template": "product_views_option_phone.tpl"
				},
				{
					"type": "timeofday",
					"template": "product_views_option_timeofday.tpl"
				},
				{
					"type": "checkbox",
					"template": "product_views_option_checkbox.tpl"
				},
				{
					"type": "default",
					"template": "product_views_option_text.tpl"
				}
			],
			"facetCellByType": [
				{
					"type": "default",
					"template": "product_views_option_facets_color.tpl"
				}
			],
			"selectedByType": [
				{
					"type": "default",
					"template": "transaction_line_views_selected_option.tpl"
				}
			]
		},
		"maximumOptionValuesQuantityWithoutPusher": 8
	},
	"listHeader": {
		"filterRangeQuantityDays": 0
	},
	"cms": {
		"contentWait": 200,
		"useCMS": true,
		"escToLoginDisabled": false,
		"baseUrl": "",
		"adapterVersion": "3"
	},
	"productline": {
		"multiImageOption": [
			"custcol4",
			"custcol3"
		]
	},
	"productList": {
		"additionEnabled": true,
		"loginRequired": true,
		"listTemplates": [
			{
				"templateId": "1",
				"name": "My list",
				"description": "An example predefined list",
				"scopeId": 2,
				"scopeName": "private"
			},
			{
				"templateId": "2",
				"name": "Saved for Later",
				"description": "This is for the cart saved for later items",
				"scopeId": 2,
				"scopeName": "private",
				"typeId": "2",
				"typeName": "later"
			},
			{
				"templateId": "3",
				"name": "Request a Quote",
				"description": "This is for the request a quote items",
				"scopeId": 2,
				"scopeName": "private",
				"typeId": "4",
				"typeName": "quote"
			}
		],
		"templates": [
			{
				"id": "list",
				"name": "List",
				"columns": 1,
				"icon": "list-header-view-icon-list",
				"isDefault": true
			},
			{
				"id": "condensed",
				"name": "Condensed",
				"columns": 1,
				"icon": "list-header-view-icon-condensed"
			}
		]
	},
	"productReviews": {
		"maxFlagsCount": 2,
		"loginRequired": false,
		"flaggedStatus": 4,
		"approvedStatus": "2",
		"pendingApprovalStatus": 1,
		"resultsPerPage": 25,
		"maxRate": 5,
		"computeOverall": true,
		"filterOptions": [
			{
				"id": "all",
				"name": "All Reviews",
				"params": "{}",
				"isDefault": true
			},
			{
				"id": "5star",
				"name": "5 Star Reviews",
				"params": "{\"rating\": 5}",
				"isDefault": false
			},
			{
				"id": "4star",
				"name": "4 Star Reviews",
				"params": "{\"rating\": 4}",
				"isDefault": false
			},
			{
				"id": "3star",
				"name": "3 Star Reviews",
				"params": "{\"rating\": 3}",
				"isDefault": false
			},
			{
				"id": "2star",
				"name": "2 Star Reviews",
				"params": "{\"rating\": 2}",
				"isDefault": false
			},
			{
				"id": "1star",
				"name": "1 Star Reviews",
				"params": "{\"rating\": 1}",
				"isDefault": false
			}
		],
		"sortOptions": [
			{
				"id": "date",
				"name": "By Date",
				"params": "{\"order\": \"created_on:ASC\"}",
				"isDefault": true
			},
			{
				"id": "rating",
				"name": "By Rating",
				"params": "{\"order\": \"rating:ASC\"}",
				"isDefault": false
			}
		]
	},
	"transactionListColumns": {
		"quote": [
			{
				"id": "trandate",
				"label": "Request date:"
			},
			{
				"id": "duedate",
				"label": "Expiration date:"
			},
			{
				"id": "total",
				"label": "Amount"
			},
			{
				"id": "status",
				"label": "Status"
			}
		],
		"enableQuote": false,
		"invoiceOpen": [
			{
				"id": "duedate",
				"label": "Due Date"
			},
			{
				"id": "trandate",
				"label": "Date"
			},
			{
				"id": "amount",
				"label": "Amount"
			}
		],
		"invoicePaid": [
			{
				"id": "trandate",
				"label": "Date"
			},
			{
				"id": "closedate",
				"label": "Close Date"
			},
			{
				"id": "amount",
				"label": "Amount"
			}
		],
		"enableInvoice": false,
		"orderHistory": [
			{
				"id": "trandate",
				"label": "Date"
			},
			{
				"id": "amount",
				"label": "Amount"
			},
			{
				"id": "status",
				"label": "Status"
			}
		],
		"enableOrderHistory": false,
		"returnAuthorization": [
			{
				"id": "trandate",
				"label": "Date"
			},
			{
				"id": "quantity",
				"label": "Items:"
			},
			{
				"id": "amount",
				"label": "Amount"
			},
			{
				"id": "status",
				"label": "Status"
			}
		],
		"enableReturnAuthorization": false
	},
	"quote": {
		"daysToExpirationNotification": 7,
		"daysToExpire": 0,
		"disclaimerSummary": "To place the order please contact <strong>Contact Center</strong> at <strong>(000)-XXX-XXXX</strong> or send an email to <a href=\"mailto:xxxx@xxxx.com\">xxxx@xxxx.com</a>",
		"disclaimer": "For immediate assistance contact <strong>Contact Center</strong> at <strong>(000)-XXX-XXXX</strong> or send an email to <a href=\"mailto:xxxx@xxxx.com\">xxxx@xxxx.com</a>",
		"defaultPhone": "(000)-XXX-XXXX",
		"defaultEmail": "xxxx@xxxx.com",
		"purchaseReadyStatusId": "12",
		"showHyperlink": true,
		"textHyperlink": "Request a Quote",
		"requestAQuoteWizardBottomMessage": "Once your quote has been submitted, a sales representative will contact you in <strong>XX business days</strong>. For immediate assistance call us at <strong>(000)-XXX-XXXX</strong> or email us at <a href='mailto:xxxx@xxxx.com'>xxxx@xxxx.com</a>",
		"contactBusinessDaysMessage": "A sales representative will contact you in <strong>XX business days</strong>."
	},
	"recentlyViewedItems": {
		"useCookie": true,
		"numberOfItemsDisplayed": 6
	},
	"faviconPath": "",
	"filterSite": {
		"option": "current"
	},
	"orderShoppingFieldKeys": {
		"keys": [
			"shipaddress",
			"summary",
			"promocodes"
		],
		"items": [
			"amount",
			"promotionamount",
			"promotiondiscount",
			"orderitemid",
			"quantity",
			"minimimquantity",
			"onlinecustomerprice_detail",
			"internalid",
			"options",
			"itemtype",
			"rate",
			"rate_formatted",
			"taxrate1",
			"taxtype1",
			"taxrate2",
			"taxtype2",
			"tax1amt",
			"discounts_impact"
		]
	},
	"orderCheckoutFieldKeys": {
		"keys": [
			"giftcertificates",
			"shipaddress",
			"billaddress",
			"payment",
			"summary",
			"promocodes",
			"shipmethod",
			"shipmethods",
			"agreetermcondition",
			"purchasenumber"
		],
		"items": [
			"amount",
			"promotionamount",
			"promotiondiscount",
			"orderitemid",
			"quantity",
			"minimumquantity",
			"maximumquantity",
			"onlinecustomerprice_detail",
			"internalid",
			"rate",
			"rate_formatted",
			"options",
			"itemtype",
			"itemid",
			"taxrate1",
			"taxtype1",
			"taxrate2",
			"taxtype2",
			"tax1amt",
			"discounts_impact"
		]
	},
	"suitescriptResultsPerPage": 20,
	"fieldKeys": {
		"itemsFieldsAdvancedName": "order",
		"itemsFieldsStandardKeys": [
			"canonicalurl",
			"displayname",
			"internalid",
			"itemid",
			"itemoptions_detail",
			"itemtype",
			"minimumquantity",
			"maximumquantity",
			"onlinecustomerprice_detail",
			"pricelevel1",
			"pricelevel1_formatted",
			"isinstock",
			"ispurchasable",
			"isbackordable",
			"outofstockmessage",
			"stockdescription",
			"showoutofstockmessage",
			"storedisplayimage",
			"storedisplayname2",
			"storedisplaythumbnail",
			"isfullfillable"
		]
	},
	"extraTranslations": [],
	"bronto": {
		"accountId": "",
		"adapterUrl": "https://cdn.bronto.com/netsuite/configure.js"
	},
	"cases": {
		"defaultValues": {
			"statusStart": {
				"id": "1"
			},
			"statusClose": {
				"id": "5"
			},
			"origin": {
				"id": "-5"
			}
		}
	},
	"checkoutApp": {
		"skipLogin": false,
		"checkoutSteps": "Standard",
		"paypalLogo": "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg",
		"invoiceTermsAndConditions": "<h4>Invoice Terms and Conditions</h4><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"
	},
	"isMultiShippingEnabled": false,
	"removePaypalAddress": true,
	"useStandardHeaderFooter": false,
	"isThreeDSecureEnabled": false,
	"autoPopulateNameAndEmail": true,
	"forms": {
		"loginAsGuest": {
			"showName": false,
			"showEmail": true
		},
		"address": {
			"showAddressLineTwo": true
		}
	},
	"defaultSearchUrl": "search",
	"searchApiMasterOptions": [
		{
			"id": "Facets",
			"fieldset": "search",
			"include": "facets"
		},
		{
			"id": "itemDetails",
			"fieldset": "details",
			"include": "facets"
		},
		{
			"id": "relatedItems",
			"fieldset": "relateditems_details"
		},
		{
			"id": "correlatedItems",
			"fieldset": "correlateditems_details"
		},
		{
			"id": "merchandisingZone"
		},
		{
			"id": "typeAhead",
			"fieldset": "typeahead"
		},
		{
			"id": "itemsSearcher",
			"fieldset": "itemssearcher"
		},
		{
			"id": "CmsAdapterSearch",
			"fieldset": "search"
		}
	],
	"defaultPaginationSettings": {
		"showPageList": true,
		"pagesToShow": 9,
		"showPageIndicator": false
	},
	"defaultPaginationSettingsPhone": {
		"showPageList": false,
		"pagesToShow": 9,
		"showPageIndicator": true
	},
	"defaultPaginationSettingsTablet": {
		"showPageList": true,
		"pagesToShow": 4,
		"showPageIndicator": true
	},
	"paymentmethods": [
		{
			"key": "5,5,1555641112",
			"regex": "^4[0-9]{12}(?:[0-9]{3})?$",
			"description": "VISA"
		},
		{
			"key": "4,5,1555641112",
			"regex": "^(5[1-5][0-9]{14}|2(2(2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7([0-1][0-9]|20))[0-9]{12})$",
			"description": "Master Card"
		},
		{
			"key": "6,5,1555641112",
			"regex": "^3[47][0-9]{13}$",
			"description": "American Express"
		},
		{
			"key": "3,5,1555641112",
			"regex": "^6(?:011|5[0-9]{2})[0-9]{12}$",
			"description": "Discover"
		},
		{
			"key": "16,5,1555641112",
			"regex": "^(50|5[6-9]|6[0-4]|6[6-9])\\d{12,19}$",
			"description": "Maestro"
		},
		{
			"key": "17,3,1555641112",
			"regex": "",
			"description": "This company allows both private individuals and businesses to accept payments over the Internet"
		}
	],
	"cookieWarningBanner": {
		"closable": true,
		"saveInCookie": true,
		"anchorText": "Learn More",
		"message": "To provide a better shopping experience, our website uses cookies. Continuing use of the site implies consent."
	},
	"tracking": {
		"googleAdWordsConversion": {
			"id": "",
			"value": 0,
			"label": ""
		},
		"googleTagManager": {
			"isMultiDomain": false,
			"id": "",
			"dataLayerName": "dataLayer"
		},
		"googleUniversalAnalytics": {
			"propertyID": "",
			"domainName": "",
			"domainNameSecure": ""
		}
	},
	"header": {
		"notShowCurrencySelector": false,
		"logoUrl": "",
		"showRecognizedShopper": false
	},
	"home": {
		"carouselImages": [],
		"bottomBannerImages": []
	},
	"transactionRecordOriginMapping": [
		{
			"id": "backend",
			"origin": 0,
			"name": "",
			"detailedName": "Purchase"
		},
		{
			"id": "inStore",
			"origin": 1,
			"name": "In Store",
			"detailedName": "In Store Purchase"
		},
		{
			"id": "online",
			"origin": 2,
			"name": "Online",
			"detailedName": "Online Purchase"
		}
	],
	"overview": {
		"customerSupportURL": "",
		"homeBanners": [],
		"homeRecentOrdersQuantity": 3
	},
	"isPickupInStoreEnabled": false,
	"productDetailsInformation": [
		{
			"name": "Details",
			"contentFromKey": "storedetaileddescription",
			"itemprop": "description"
		}
	],
	"structureddatamarkup": {
		"type": "No Markup",
		"availabilityonbackorder": "PreOrder"
	},
	"quickOrder": {
		"showHyperlink": true,
		"textHyperlink": "Quick Order"
	},
	"quoteToSalesorderWizard": {
		"invoiceFormId": "89"
	},
	"myAccountPreferences": {
		"reorderEnabled": false
	},
	"returnAuthorization": {
		"cancelUrlRoot": "https://system.netsuite.com",
		"reasons": [
			{
				"text": "Wrong Item Shipped",
				"id": 1,
				"order": 1
			},
			{
				"text": "Did not fit",
				"id": 2,
				"order": 2
			},
			{
				"text": "Quality did not meet my standards",
				"id": 3,
				"order": 3
			},
			{
				"text": "Not as pictured on the Website",
				"id": 4,
				"order": 4
			},
			{
				"text": "Damaged during shipping",
				"id": 5,
				"order": 5
			},
			{
				"text": "Changed my mind",
				"id": 6,
				"order": 6
			},
			{
				"text": "Item was defective",
				"id": 7,
				"order": 7
			},
			{
				"text": "Arrived too late",
				"id": 8,
				"order": 8
			},
			{
				"text": "Other",
				"id": 9,
				"order": 9,
				"isOther": true
			}
		]
	},
	"isSCISIntegrationEnabled": true,
	"locationTypeMapping": {
		"store": {
			"internalid": "1",
			"name": "Store"
		}
	},
	"isSafeMode": false,
	"navigationData": [
		{
			"text": "Home",
			"href": "/",
			"dataTouchpoint": "home",
			"dataHashtag": "#/",
			"level": "1",
			"classnames": "header-menu-home-anchor"
		},
		{
			"text": "Shop",
			"href": "/search",
			"dataTouchpoint": "home",
			"dataHashtag": "#/search",
			"level": "1",
			"classnames": "header-menu-shop-anchor"
		},
		{
			"text": "Categories placeholder",
			"level": "1",
			"placeholder": "Categories"
		}
	],
	"typeahead": {
		"minLength": 3,
		"maxResults": 4,
		"sort": "relevance:desc"
	},
	"security": {
		"allowFraming": "DISALLOW FRAMING",
		"allowFramingBy": [
			"SAMEORIGIN"
		]
	},
	"cache": {
		"contentPageCdn": "MEDIUM",
		"contentPageTtl": 7200
	},
	"addThis": {
		"enable": false,
		"pubId": "ra-50abc2544eed5fa5",
		"toolboxClass": "addthis_default_style addthis_toolbox addthis_button_compact",
		"servicesToShow": [
			{
				"key": "facebook",
				"value": "Facebook"
			},
			{
				"key": "google_plusone",
				"value": ""
			},
			{
				"key": "email",
				"value": "Email"
			},
			{
				"key": "expanded",
				"value": "More"
			}
		],
		"options": [
			{
				"key": "username",
				"value": ""
			},
			{
				"key": "data_track_addressbar",
				"value": true
			}
		]
	},
	"facebook": {
		"enable": false,
		"appId": "",
		"popupOptions": {
			"status": "no",
			"resizable": "yes",
			"scrollbars": "yes",
			"personalbar": "no",
			"directories": "no",
			"location": "no",
			"toolbar": "no",
			"menubar": "no",
			"width": 500,
			"height": 250,
			"left": 0,
			"top": 0
		}
	},
	"googlePlus": {
		"enable": true,
		"popupOptions": {
			"status": "no",
			"resizable": "yes",
			"scrollbars": "yes",
			"personalbar": "no",
			"directories": "no",
			"location": "no",
			"toolbar": "no",
			"menubar": "no",
			"width": 600,
			"height": 600,
			"left": 0,
			"top": 0
		}
	},
	"pinterest": {
		"enableHover": true,
		"enableButton": true,
		"imageSize": "main",
		"popupOptions": {
			"status": "no",
			"resizable": "yes",
			"scrollbars": "yes",
			"personalbar": "no",
			"directories": "no",
			"location": "no",
			"toolbar": "no",
			"menubar": "no",
			"width": 680,
			"height": 300,
			"left": 0,
			"top": 0
		}
	},
	"twitter": {
		"enable": true,
		"popupOptions": {
			"status": "no",
			"resizable": "yes",
			"scrollbars": "yes",
			"personalbar": "no",
			"directories": "no",
			"location": "no",
			"toolbar": "no",
			"menubar": "no",
			"width": 632,
			"height": 250,
			"left": 0,
			"top": 0
		},
		"via": ""
	},
	"storeLocator": {
		"icons": {
			"stores": "img/default-marker.png",
			"position": "img/position-marker.png",
			"autocomplete": "img/position-marker.png"
		},
		"zoomInDetails": 17,
		"openPopupOnMouseOver": true,
		"title": "Store Locator",
		"isEnabled": true,
		"radius": 50,
		"showLocalizationMap": true,
		"showAllStoresRecordsPerPage": 28,
		"defaultTypeLocations": "1",
		"defaultQuantityLocations": 3,
		"distanceUnit": "mi",
		"apiKey": "",
		"mapOptions": {
			"centerPosition": {
				"latitude": -34.86993,
				"longitude": -56.145212
			},
			"zoom": 11,
			"mapTypeControl": false,
			"streetViewControl": false,
			"mapTypeId": "ROADMAP"
		}
	},
	"subscriptions": {
		"lineStatusChange": "Allow Suspending / Resuming",
		"allowToCancelSuspendRequiredLines": false,
		"generalStatusChange": "Allow Suspending / Resuming",
		"disallowUpgradeQuantity": false,
		"disallowDowngradeQuantity": false
	}
};
			}
			exports.configurationManifest = configurationManifest;
		});