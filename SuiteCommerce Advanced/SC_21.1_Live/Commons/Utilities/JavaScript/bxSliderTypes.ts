/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <reference types="jquery"/>

export interface SliderOptions {
    minSlides?: number;
    slideWidth?: number;
    maxSlides?: number;
    forceStart?: boolean;
    pager?: boolean;
    touchEnabled?: boolean;
    nextText: string;
    prevText: string;
    controls?: boolean;
    preloadImages?: string;
    buildPager?: (index: number) => void;
    startSlide?: number;
    adaptiveHeight?: boolean;
}

interface BxSlider {
    goToNextSlide: () => void;
    goToPrevSlide: () => void;
    getCurrentSlide: () => number;
    getSlideCount: () => number;
}

export interface JQueryBxSlider extends JQuery {
    bxSlider(sliderOptions?: SliderOptions): BxSlider;
}
