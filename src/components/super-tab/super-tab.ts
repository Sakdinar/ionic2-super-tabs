import {
  Component, Input, Renderer, ElementRef, ViewEncapsulation, Optional, ComponentFactoryResolver,
  NgZone, ViewContainerRef, ViewChild, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ErrorHandler
} from '@angular/core';
import { NavControllerBase, App, Config, Platform, Keyboard, GestureController, DeepLinker, DomController } from 'ionic-angular';
import { TransitionController } from 'ionic-angular/transitions/transition-controller';
import { SuperTabs } from '../super-tabs/super-tabs';

@Component({
  selector: 'super-tab',
  template: '<div #viewport></div><div class="nav-decor"></div>',
  encapsulation: ViewEncapsulation.None
})
export class SuperTab extends NavControllerBase implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  title: string;

  get tabTitle() {
    return this.title;
  }

  get index() {
    return this.parent.getTabIndexById(this.tabId);
  }

  @Input()
  icon: string;

  /**
   * @input {Page} Set the root page for this tab.
   */
  @Input() root: any;

  /**
   * @input {object} Any nav-params to pass to the root page of this tab.
   */
  @Input() rootParams: any;

  @Input('id')
  tabId: string;

  get _tabId() {
    return this.tabId;
  }

  @Input()
  badge: number = 0;


  @Input()
  get swipeBackEnabled(): boolean {
    return this._sbEnabled;
  }
  set swipeBackEnabled(val: boolean) {
    this._sbEnabled = !!val;
    this._swipeBackCheck();
  }

  /**
   * @hidden
   */
  @ViewChild('viewport', {read: ViewContainerRef})
  set _vp(val: ViewContainerRef) {
    this.setViewport(val);
  }

  private active: boolean = true;

  constructor(
    parent: SuperTabs,
    app: App,
    config: Config,
    plt: Platform,
    keyboard: Keyboard,
    el: ElementRef,
    zone: NgZone,
    rnd: Renderer,
    cfr: ComponentFactoryResolver,
    gestureCtrl: GestureController,
    transCtrl: TransitionController,
    errorHandler: ErrorHandler,
    @Optional() private linker: DeepLinker,
    private _dom: DomController,
    private cd: ChangeDetectorRef
  ) {
    super(parent, app, config, plt, keyboard, el, zone, rnd, cfr, gestureCtrl, transCtrl, linker, _dom, errorHandler);
  }

  ngOnInit() {
    this.parent.addTab(this);
  }

  ngAfterViewInit() {
    this.push(this.root, this.rootParams, { animate: false });
  }

  ngOnDestroy() {
    this.destroy();
  }

  setActive(active: boolean) {
    if (active && !this.active) {
      this.cd.reattach();
      // TODO check if you need to detect changes manually
      // this.cd.detectChanges();
    } else if (!active && this.active) {
      this.cd.detach();
    }
  }

  setBadge(value: number) {
    this.badge = value;
  }

  clearBadge() {
    this.badge = 0;
  }

  increaseBadge(increaseBy: number) {
    this.badge += increaseBy;
  }

  decreaseBadge(decreaseBy: number) {
    this.badge = Math.max(0, this.badge - decreaseBy);
  }

  setWidth(width: number) {
    this.setElementStyle('width', width + 'px');
  }

}
