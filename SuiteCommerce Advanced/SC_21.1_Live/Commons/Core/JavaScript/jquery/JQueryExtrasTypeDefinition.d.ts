/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="JQueryExtrasTypeDefinition"/>

interface JQuery<TElement = HTMLElement> extends Iterable<TElement> {
	serializeObject(): { [key: string]: string | number | string[] | undefined };
	modal(action: string): JQuery<TElement>;
	collapse(status: 'show' | 'hide');
}
