/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { ActionActivationStrategy, CookieConsent, DataProviderRegistration, DiscardStrategy, EventAction, LoadStrategy, VisitStrategy } from ".";
import { HistoryType, RouterService } from "./services";
export namespace Components {
    interface XAction {
        /**
          * The command to execute.
         */
        "command": string;
        /**
          * The JSON serializable data payload the command requires.
         */
        "data": string;
        /**
          * Get the underlying actionEvent instance. Used by the x-action-activator element.
         */
        "getAction": () => Promise<EventAction<any>>;
        /**
          * This is the topic this action-command is targeting.
         */
        "topic": 'data'|'routing'|'document'|'audio'|'video';
    }
    interface XActionActivator {
        /**
          * The activation strategy to use for the contained actions.
         */
        "activate": ActionActivationStrategy;
        "activateActions": () => Promise<void>;
        /**
          * Turn on debug statements for load, update and render events.
         */
        "debug": boolean;
        /**
          * Allow the actions to fire more than once per the event.
         */
        "multiple": boolean;
        /**
          * The element to watch for events when using the OnElementEvent activation strategy. This element uses the HTML Element querySelector function to find the element.  For use with activate="OnElementEvent" Only!
         */
        "targetElement"?: string;
        /**
          * This is the name of the event to listen to on the target element.
         */
        "targetEvent": string;
        /**
          * The time, in seconds at which the contained actions should be submitted.  For use with activate="AtTime" Only!
         */
        "time": number;
    }
    interface XAudioMusicAction {
        /**
          * The command to execute.
         */
        "command": 'start'|'pause'|'resume'|'mute'|'volume'|'seek';
        /**
          * Get the underlying actionEvent instance. Used by the x-action-activator element.
         */
        "getAction": () => Promise<EventAction<any>>;
        /**
          * The track to target.
         */
        "trackId"?: string;
        /**
          * The value payload for the command.
         */
        "value": string|boolean|number;
    }
    interface XAudioMusicLoad {
        /**
          * The discard strategy the player should use for this file.
         */
        "discard": DiscardStrategy;
        /**
          * Set this to true to have the audio file loop.
         */
        "loop": boolean;
        /**
          * This is the topic this action-command is targeting.
         */
        "mode": LoadStrategy;
        /**
          * The path to the audio-file.
          * @required
         */
        "src": string;
        /**
          * Set this attribute to have the audio file tracked in session effectively preventing it from playing again..
         */
        "track": boolean;
        /**
          * The identifier for this music track
         */
        "trackId": string;
    }
    interface XAudioPlayer {
        "debug": boolean;
        /**
          * The display mode for this player. The display is merely a facade to manage basic controls. No track information or duration will be displayed.
         */
        "display": boolean;
    }
    interface XAudioSoundAction {
        /**
          * The command to execute.
         */
        "command": 'start'|'pause'|'resume'|'mute'|'volume'|'seek';
        /**
          * Get the underlying actionEvent instance. Used by the x-action-activator element.
         */
        "getAction": () => Promise<EventAction<any>>;
        /**
          * The track to target.
         */
        "trackId"?: string;
        /**
          * The value payload for the command.
         */
        "value": string|boolean|number;
    }
    interface XAudioSoundLoad {
        /**
          * The discard strategy the player should use for this file.
         */
        "discard": DiscardStrategy;
        /**
          * This is the topic this action-command is targeting.
         */
        "mode": LoadStrategy;
        /**
          * The path to the audio-file.
          * @required
         */
        "src": string;
        /**
          * Set this attribute to have the audio file tracked in session effectively preventing it from playing again..
         */
        "track": boolean;
        /**
          * The identifier for this music track
         */
        "trackId": string;
    }
    interface XDataDisplay {
        /**
          * If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.
         */
        "noRender": boolean;
        /**
          * The data expression to obtain a value for rendering as inner-text for this element.
          * @example {session:user.name}
          * @default null
         */
        "text"?: string;
    }
    interface XDataProviderCookie {
        /**
          * An expression that tells this component how to determine if the user has previously consented.
          * @example {storage:consented}
         */
        "hideWhen": string;
        /**
          * When skipConsent is true, the accept-cookies banner will not be displayed before accessing cookie-data.
         */
        "skipConsent": boolean;
    }
    interface XDataRepeat {
        /**
          * Turn on debug statements for load, update and render events.
         */
        "debug": boolean;
        /**
          * The JSONata query to filter the json items see https://try.jsonata.org/ for more info.
         */
        "filter"?: string;
        /**
          * The array-string or data expression to obtain a collection for rendering the template.
          * @example {session:cart.items}
         */
        "items"?: string;
        /**
          * The URL to remote JSON collection to use for the items.
          * @example /data.json
         */
        "itemsSrc"?: string;
        /**
          * If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.
         */
        "noRender": boolean;
    }
    interface XDataShow {
        /**
          * The data expression to obtain a predicate for conditionally rendering the inner-contents of this element.
          * @example {session:user.name}
         */
        "when": string;
    }
    interface XInclude {
        /**
          * If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.
         */
        "noRender": boolean;
        /**
          * Remote Template URL
         */
        "src": string;
    }
    interface XLink {
        "activeClass": string;
        "anchorClass"?: string;
        "anchorId"?: string;
        "anchorRole"?: string;
        "anchorTabIndex"?: string;
        "anchorTitle"?: string;
        "ariaHaspopup"?: string;
        "ariaLabel"?: string;
        "ariaPosinset"?: string;
        "ariaSetsize"?: number;
        "custom": string;
        "exact": boolean;
        "href": string;
        "strict": boolean;
    }
    interface XMarkdown {
        /**
          * Base Url for embedded links
         */
        "baseUrl": string;
        /**
          * If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.
         */
        "noRender": boolean;
        /**
          * Remote Template URL
         */
        "src": string;
    }
    interface XUi {
        /**
          * This is the application / site title. If the views or dos have titles, this is added as a suffix.
         */
        "appTitle": string;
        /**
          * Turn on debugging to get helpful messages from the routing, data and action systems.
         */
        "debug": boolean;
        /**
          * Set this to false if you don't want the UI component to take up the full page size.   *
         */
        "fullPage": boolean;
        /**
          * Browser (paths) or Hash (#) routing. To support browser history, the HTTP server must be setup for a PWA
         */
        "mode": HistoryType;
        /**
          * This is the root path that the actual page is, if it isn't '/', then the router needs to know where to begin creating paths.
         */
        "root": string;
        /**
          * This is the router service instantiated with this component.
         */
        "router": RouterService;
        /**
          * Header height or offset for scroll-top on this and all views.
         */
        "scrollTopOffset"?: number;
        /**
          * This is the start path a user should land on when they first land on this app.
         */
        "startUrl": string;
        /**
          * Navigation transition between routes. This is a CSS animation class.
         */
        "transition": string;
    }
    interface XUse {
        /**
          * When inline the link/script tags are rendered in-place rather than added to the head.
         */
        "inline": boolean;
        /**
          * Import the script file as a module.
         */
        "module": boolean;
        /**
          * Declare the script only for use when modules aren't supported
         */
        "noModule": boolean;
        "nowait": boolean;
        /**
          * The script file to reference.
         */
        "scriptSrc"?: string;
        /**
          * The css file to reference
         */
        "styleSrc"?: string;
    }
    interface XView {
        /**
          * Remote URL for this Route's content.
         */
        "contentSrc": string;
        /**
          * Turn on debug statements for load, update and render events.
         */
        "debug": boolean;
        /**
          * The url for this route should only be matched when it is exact.
         */
        "exact": boolean;
        /**
          * The title for this view. This is prefixed before the app title configured in x-ui
         */
        "pageTitle": string;
        /**
          * Header height or offset for scroll-top on this view.
         */
        "scrollTopOffset"?: number;
        /**
          * Navigation transition between routes. This is a CSS animation class.
         */
        "transition"?: string;
        /**
          * The url for this route, including the parent's routes.
         */
        "url": string;
    }
    interface XViewDo {
        /**
          * Remote URL for this Route's content.
         */
        "contentSrc": string;
        /**
          * To debug timed elements, set this value to true.
         */
        "debug": boolean;
        /**
          * How should this page be presented (coming soon)
         */
        "display": 'page' | 'modal' | 'full';
        /**
          * The url for this route should only be matched when it is exact.
         */
        "exact": boolean;
        /**
          * When this value exists, the page will automatically progress when the duration in seconds has passed.
         */
        "nextAfter": number;
        /**
          * The title for this view. This is prefixed before the app title configured in x-ui
         */
        "pageTitle": string;
        /**
          * Header height or offset for scroll-top on this view.
         */
        "scrollTopOffset"?: number;
        /**
          * Navigation transition between routes. This is a CSS animation class.
         */
        "transition"?: string;
        /**
          * The url for this route, including the parent's routes.
         */
        "url": string;
        /**
          * The visit strategy for this do. once: persist the visit and never force it again always: do not persist, but don't don't show again in-session optional: do not force this view-do ever. It will be available by URL
         */
        "visit": VisitStrategy;
        /**
          * If present, the expression must evaluate to true for this route to be sequenced by the parent view. The existence of this value overrides the visit strategy
         */
        "when"?: string;
    }
}
declare global {
    interface HTMLXActionElement extends Components.XAction, HTMLStencilElement {
    }
    var HTMLXActionElement: {
        prototype: HTMLXActionElement;
        new (): HTMLXActionElement;
    };
    interface HTMLXActionActivatorElement extends Components.XActionActivator, HTMLStencilElement {
    }
    var HTMLXActionActivatorElement: {
        prototype: HTMLXActionActivatorElement;
        new (): HTMLXActionActivatorElement;
    };
    interface HTMLXAudioMusicActionElement extends Components.XAudioMusicAction, HTMLStencilElement {
    }
    var HTMLXAudioMusicActionElement: {
        prototype: HTMLXAudioMusicActionElement;
        new (): HTMLXAudioMusicActionElement;
    };
    interface HTMLXAudioMusicLoadElement extends Components.XAudioMusicLoad, HTMLStencilElement {
    }
    var HTMLXAudioMusicLoadElement: {
        prototype: HTMLXAudioMusicLoadElement;
        new (): HTMLXAudioMusicLoadElement;
    };
    interface HTMLXAudioPlayerElement extends Components.XAudioPlayer, HTMLStencilElement {
    }
    var HTMLXAudioPlayerElement: {
        prototype: HTMLXAudioPlayerElement;
        new (): HTMLXAudioPlayerElement;
    };
    interface HTMLXAudioSoundActionElement extends Components.XAudioSoundAction, HTMLStencilElement {
    }
    var HTMLXAudioSoundActionElement: {
        prototype: HTMLXAudioSoundActionElement;
        new (): HTMLXAudioSoundActionElement;
    };
    interface HTMLXAudioSoundLoadElement extends Components.XAudioSoundLoad, HTMLStencilElement {
    }
    var HTMLXAudioSoundLoadElement: {
        prototype: HTMLXAudioSoundLoadElement;
        new (): HTMLXAudioSoundLoadElement;
    };
    interface HTMLXDataDisplayElement extends Components.XDataDisplay, HTMLStencilElement {
    }
    var HTMLXDataDisplayElement: {
        prototype: HTMLXDataDisplayElement;
        new (): HTMLXDataDisplayElement;
    };
    interface HTMLXDataProviderCookieElement extends Components.XDataProviderCookie, HTMLStencilElement {
    }
    var HTMLXDataProviderCookieElement: {
        prototype: HTMLXDataProviderCookieElement;
        new (): HTMLXDataProviderCookieElement;
    };
    interface HTMLXDataRepeatElement extends Components.XDataRepeat, HTMLStencilElement {
    }
    var HTMLXDataRepeatElement: {
        prototype: HTMLXDataRepeatElement;
        new (): HTMLXDataRepeatElement;
    };
    interface HTMLXDataShowElement extends Components.XDataShow, HTMLStencilElement {
    }
    var HTMLXDataShowElement: {
        prototype: HTMLXDataShowElement;
        new (): HTMLXDataShowElement;
    };
    interface HTMLXIncludeElement extends Components.XInclude, HTMLStencilElement {
    }
    var HTMLXIncludeElement: {
        prototype: HTMLXIncludeElement;
        new (): HTMLXIncludeElement;
    };
    interface HTMLXLinkElement extends Components.XLink, HTMLStencilElement {
    }
    var HTMLXLinkElement: {
        prototype: HTMLXLinkElement;
        new (): HTMLXLinkElement;
    };
    interface HTMLXMarkdownElement extends Components.XMarkdown, HTMLStencilElement {
    }
    var HTMLXMarkdownElement: {
        prototype: HTMLXMarkdownElement;
        new (): HTMLXMarkdownElement;
    };
    interface HTMLXUiElement extends Components.XUi, HTMLStencilElement {
    }
    var HTMLXUiElement: {
        prototype: HTMLXUiElement;
        new (): HTMLXUiElement;
    };
    interface HTMLXUseElement extends Components.XUse, HTMLStencilElement {
    }
    var HTMLXUseElement: {
        prototype: HTMLXUseElement;
        new (): HTMLXUseElement;
    };
    interface HTMLXViewElement extends Components.XView, HTMLStencilElement {
    }
    var HTMLXViewElement: {
        prototype: HTMLXViewElement;
        new (): HTMLXViewElement;
    };
    interface HTMLXViewDoElement extends Components.XViewDo, HTMLStencilElement {
    }
    var HTMLXViewDoElement: {
        prototype: HTMLXViewDoElement;
        new (): HTMLXViewDoElement;
    };
    interface HTMLElementTagNameMap {
        "x-action": HTMLXActionElement;
        "x-action-activator": HTMLXActionActivatorElement;
        "x-audio-music-action": HTMLXAudioMusicActionElement;
        "x-audio-music-load": HTMLXAudioMusicLoadElement;
        "x-audio-player": HTMLXAudioPlayerElement;
        "x-audio-sound-action": HTMLXAudioSoundActionElement;
        "x-audio-sound-load": HTMLXAudioSoundLoadElement;
        "x-data-display": HTMLXDataDisplayElement;
        "x-data-provider-cookie": HTMLXDataProviderCookieElement;
        "x-data-repeat": HTMLXDataRepeatElement;
        "x-data-show": HTMLXDataShowElement;
        "x-include": HTMLXIncludeElement;
        "x-link": HTMLXLinkElement;
        "x-markdown": HTMLXMarkdownElement;
        "x-ui": HTMLXUiElement;
        "x-use": HTMLXUseElement;
        "x-view": HTMLXViewElement;
        "x-view-do": HTMLXViewDoElement;
    }
}
declare namespace LocalJSX {
    interface XAction {
        /**
          * The command to execute.
         */
        "command"?: string;
        /**
          * The JSON serializable data payload the command requires.
         */
        "data"?: string;
        /**
          * This is the topic this action-command is targeting.
         */
        "topic"?: 'data'|'routing'|'document'|'audio'|'video';
    }
    interface XActionActivator {
        /**
          * The activation strategy to use for the contained actions.
         */
        "activate": ActionActivationStrategy;
        /**
          * Turn on debug statements for load, update and render events.
         */
        "debug"?: boolean;
        /**
          * Allow the actions to fire more than once per the event.
         */
        "multiple"?: boolean;
        /**
          * The element to watch for events when using the OnElementEvent activation strategy. This element uses the HTML Element querySelector function to find the element.  For use with activate="OnElementEvent" Only!
         */
        "targetElement"?: string;
        /**
          * This is the name of the event to listen to on the target element.
         */
        "targetEvent"?: string;
        /**
          * The time, in seconds at which the contained actions should be submitted.  For use with activate="AtTime" Only!
         */
        "time"?: number;
    }
    interface XAudioMusicAction {
        /**
          * The command to execute.
         */
        "command"?: 'start'|'pause'|'resume'|'mute'|'volume'|'seek';
        /**
          * The track to target.
         */
        "trackId"?: string;
        /**
          * The value payload for the command.
         */
        "value"?: string|boolean|number;
    }
    interface XAudioMusicLoad {
        /**
          * The discard strategy the player should use for this file.
         */
        "discard"?: DiscardStrategy;
        /**
          * Set this to true to have the audio file loop.
         */
        "loop"?: boolean;
        /**
          * This is the topic this action-command is targeting.
         */
        "mode"?: LoadStrategy;
        /**
          * The path to the audio-file.
          * @required
         */
        "src": string;
        /**
          * Set this attribute to have the audio file tracked in session effectively preventing it from playing again..
         */
        "track"?: boolean;
        /**
          * The identifier for this music track
         */
        "trackId"?: string;
    }
    interface XAudioPlayer {
        "debug"?: boolean;
        /**
          * The display mode for this player. The display is merely a facade to manage basic controls. No track information or duration will be displayed.
         */
        "display"?: boolean;
    }
    interface XAudioSoundAction {
        /**
          * The command to execute.
         */
        "command"?: 'start'|'pause'|'resume'|'mute'|'volume'|'seek';
        /**
          * The track to target.
         */
        "trackId"?: string;
        /**
          * The value payload for the command.
         */
        "value"?: string|boolean|number;
    }
    interface XAudioSoundLoad {
        /**
          * The discard strategy the player should use for this file.
         */
        "discard"?: DiscardStrategy;
        /**
          * This is the topic this action-command is targeting.
         */
        "mode"?: LoadStrategy;
        /**
          * The path to the audio-file.
          * @required
         */
        "src": string;
        /**
          * Set this attribute to have the audio file tracked in session effectively preventing it from playing again..
         */
        "track"?: boolean;
        /**
          * The identifier for this music track
         */
        "trackId": string;
    }
    interface XDataDisplay {
        /**
          * If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.
         */
        "noRender"?: boolean;
        /**
          * The data expression to obtain a value for rendering as inner-text for this element.
          * @example {session:user.name}
          * @default null
         */
        "text"?: string;
    }
    interface XDataProviderCookie {
        /**
          * An expression that tells this component how to determine if the user has previously consented.
          * @example {storage:consented}
         */
        "hideWhen"?: string;
        /**
          * This event is raised when the component obtains consent from the user to use cookies. The data-provider system should capture this event and register the provider for use in expressions.
         */
        "onActionEvent"?: (event: CustomEvent<EventAction<DataProviderRegistration>>) => void;
        /**
          * This event is raised when the consents to cookies.
         */
        "onDidConsent"?: (event: CustomEvent<CookieConsent>) => void;
        /**
          * When skipConsent is true, the accept-cookies banner will not be displayed before accessing cookie-data.
         */
        "skipConsent"?: boolean;
    }
    interface XDataRepeat {
        /**
          * Turn on debug statements for load, update and render events.
         */
        "debug"?: boolean;
        /**
          * The JSONata query to filter the json items see https://try.jsonata.org/ for more info.
         */
        "filter"?: string;
        /**
          * The array-string or data expression to obtain a collection for rendering the template.
          * @example {session:cart.items}
         */
        "items"?: string;
        /**
          * The URL to remote JSON collection to use for the items.
          * @example /data.json
         */
        "itemsSrc"?: string;
        /**
          * If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.
         */
        "noRender"?: boolean;
    }
    interface XDataShow {
        /**
          * The data expression to obtain a predicate for conditionally rendering the inner-contents of this element.
          * @example {session:user.name}
         */
        "when": string;
    }
    interface XInclude {
        /**
          * If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.
         */
        "noRender"?: boolean;
        /**
          * Remote Template URL
         */
        "src": string;
    }
    interface XLink {
        "activeClass"?: string;
        "anchorClass"?: string;
        "anchorId"?: string;
        "anchorRole"?: string;
        "anchorTabIndex"?: string;
        "anchorTitle"?: string;
        "ariaHaspopup"?: string;
        "ariaLabel"?: string;
        "ariaPosinset"?: string;
        "ariaSetsize"?: number;
        "custom"?: string;
        "exact"?: boolean;
        "href": string;
        "strict"?: boolean;
    }
    interface XMarkdown {
        /**
          * Base Url for embedded links
         */
        "baseUrl"?: string;
        /**
          * If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.
         */
        "noRender"?: boolean;
        /**
          * Remote Template URL
         */
        "src"?: string;
    }
    interface XUi {
        /**
          * This is the application / site title. If the views or dos have titles, this is added as a suffix.
         */
        "appTitle"?: string;
        /**
          * Turn on debugging to get helpful messages from the routing, data and action systems.
         */
        "debug"?: boolean;
        /**
          * Set this to false if you don't want the UI component to take up the full page size.   *
         */
        "fullPage"?: boolean;
        /**
          * Browser (paths) or Hash (#) routing. To support browser history, the HTTP server must be setup for a PWA
         */
        "mode"?: HistoryType;
        /**
          * Listen for actionBus events.
         */
        "onActions"?: (event: CustomEvent<any>) => void;
        /**
          * Listen for eventBus events.
         */
        "onEvents"?: (event: CustomEvent<any>) => void;
        /**
          * This is the root path that the actual page is, if it isn't '/', then the router needs to know where to begin creating paths.
         */
        "root"?: string;
        /**
          * This is the router service instantiated with this component.
         */
        "router"?: RouterService;
        /**
          * Header height or offset for scroll-top on this and all views.
         */
        "scrollTopOffset"?: number;
        /**
          * This is the start path a user should land on when they first land on this app.
         */
        "startUrl"?: string;
        /**
          * Navigation transition between routes. This is a CSS animation class.
         */
        "transition"?: string;
    }
    interface XUse {
        /**
          * When inline the link/script tags are rendered in-place rather than added to the head.
         */
        "inline"?: boolean;
        /**
          * Import the script file as a module.
         */
        "module"?: boolean;
        /**
          * Declare the script only for use when modules aren't supported
         */
        "noModule"?: boolean;
        "nowait"?: boolean;
        /**
          * The script file to reference.
         */
        "scriptSrc"?: string;
        /**
          * The css file to reference
         */
        "styleSrc"?: string;
    }
    interface XView {
        /**
          * Remote URL for this Route's content.
         */
        "contentSrc"?: string;
        /**
          * Turn on debug statements for load, update and render events.
         */
        "debug"?: boolean;
        /**
          * The url for this route should only be matched when it is exact.
         */
        "exact"?: boolean;
        /**
          * The title for this view. This is prefixed before the app title configured in x-ui
         */
        "pageTitle"?: string;
        /**
          * Header height or offset for scroll-top on this view.
         */
        "scrollTopOffset"?: number;
        /**
          * Navigation transition between routes. This is a CSS animation class.
         */
        "transition"?: string;
        /**
          * The url for this route, including the parent's routes.
         */
        "url": string;
    }
    interface XViewDo {
        /**
          * Remote URL for this Route's content.
         */
        "contentSrc"?: string;
        /**
          * To debug timed elements, set this value to true.
         */
        "debug"?: boolean;
        /**
          * How should this page be presented (coming soon)
         */
        "display"?: 'page' | 'modal' | 'full';
        /**
          * The url for this route should only be matched when it is exact.
         */
        "exact"?: boolean;
        /**
          * When this value exists, the page will automatically progress when the duration in seconds has passed.
         */
        "nextAfter"?: number;
        /**
          * The title for this view. This is prefixed before the app title configured in x-ui
         */
        "pageTitle"?: string;
        /**
          * Header height or offset for scroll-top on this view.
         */
        "scrollTopOffset"?: number;
        /**
          * Navigation transition between routes. This is a CSS animation class.
         */
        "transition"?: string;
        /**
          * The url for this route, including the parent's routes.
         */
        "url": string;
        /**
          * The visit strategy for this do. once: persist the visit and never force it again always: do not persist, but don't don't show again in-session optional: do not force this view-do ever. It will be available by URL
         */
        "visit"?: VisitStrategy;
        /**
          * If present, the expression must evaluate to true for this route to be sequenced by the parent view. The existence of this value overrides the visit strategy
         */
        "when"?: string;
    }
    interface IntrinsicElements {
        "x-action": XAction;
        "x-action-activator": XActionActivator;
        "x-audio-music-action": XAudioMusicAction;
        "x-audio-music-load": XAudioMusicLoad;
        "x-audio-player": XAudioPlayer;
        "x-audio-sound-action": XAudioSoundAction;
        "x-audio-sound-load": XAudioSoundLoad;
        "x-data-display": XDataDisplay;
        "x-data-provider-cookie": XDataProviderCookie;
        "x-data-repeat": XDataRepeat;
        "x-data-show": XDataShow;
        "x-include": XInclude;
        "x-link": XLink;
        "x-markdown": XMarkdown;
        "x-ui": XUi;
        "x-use": XUse;
        "x-view": XView;
        "x-view-do": XViewDo;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "x-action": LocalJSX.XAction & JSXBase.HTMLAttributes<HTMLXActionElement>;
            "x-action-activator": LocalJSX.XActionActivator & JSXBase.HTMLAttributes<HTMLXActionActivatorElement>;
            "x-audio-music-action": LocalJSX.XAudioMusicAction & JSXBase.HTMLAttributes<HTMLXAudioMusicActionElement>;
            "x-audio-music-load": LocalJSX.XAudioMusicLoad & JSXBase.HTMLAttributes<HTMLXAudioMusicLoadElement>;
            "x-audio-player": LocalJSX.XAudioPlayer & JSXBase.HTMLAttributes<HTMLXAudioPlayerElement>;
            "x-audio-sound-action": LocalJSX.XAudioSoundAction & JSXBase.HTMLAttributes<HTMLXAudioSoundActionElement>;
            "x-audio-sound-load": LocalJSX.XAudioSoundLoad & JSXBase.HTMLAttributes<HTMLXAudioSoundLoadElement>;
            "x-data-display": LocalJSX.XDataDisplay & JSXBase.HTMLAttributes<HTMLXDataDisplayElement>;
            "x-data-provider-cookie": LocalJSX.XDataProviderCookie & JSXBase.HTMLAttributes<HTMLXDataProviderCookieElement>;
            "x-data-repeat": LocalJSX.XDataRepeat & JSXBase.HTMLAttributes<HTMLXDataRepeatElement>;
            "x-data-show": LocalJSX.XDataShow & JSXBase.HTMLAttributes<HTMLXDataShowElement>;
            "x-include": LocalJSX.XInclude & JSXBase.HTMLAttributes<HTMLXIncludeElement>;
            "x-link": LocalJSX.XLink & JSXBase.HTMLAttributes<HTMLXLinkElement>;
            "x-markdown": LocalJSX.XMarkdown & JSXBase.HTMLAttributes<HTMLXMarkdownElement>;
            "x-ui": LocalJSX.XUi & JSXBase.HTMLAttributes<HTMLXUiElement>;
            "x-use": LocalJSX.XUse & JSXBase.HTMLAttributes<HTMLXUseElement>;
            "x-view": LocalJSX.XView & JSXBase.HTMLAttributes<HTMLXViewElement>;
            "x-view-do": LocalJSX.XViewDo & JSXBase.HTMLAttributes<HTMLXViewDoElement>;
        }
    }
}
