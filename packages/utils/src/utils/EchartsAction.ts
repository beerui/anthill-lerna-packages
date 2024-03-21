type EchartOptions = any; // Adjust the type based on your ECharts options structure

interface EchartsActionConfig {
  currentIndex?: number;
  loopTime?: number;
  resetTime?: number;
  seriesIndex?: number;
}

type EchartEventCallback = (obj?: any) => void;

class EchartsAction {
  private instance: any; // Adjust the type based on your ECharts instance
  private mouseoverEvent: Set<EchartEventCallback> = new Set();
  private mouseoutEvent: Set<EchartEventCallback> = new Set();
  private globaloutEvent: Set<EchartEventCallback> = new Set();
  private seriesLength: number = 0;
  private isHighlight: boolean = false;
  private isSelect: boolean = false;
  private isShowTip: boolean = false;
  private isSetNoData: boolean = false;
  private loopTimer: any = () => {};
  private noDataConfig: { text: string; theme: string } = { text: '暂无数据', theme: 'light' };
  private resetTimer: any = () => {};
  private echartOptions: EchartOptions | null = null;
  private customLoopCallback: EchartEventCallback = () => {};
  private customMouseoverCallback: EchartEventCallback = () => {};
  private customMouseoutCallback: EchartEventCallback = () => {};
  private customGlobaloutCallback: EchartEventCallback = () => {};
  private lightNoData: string = '';
  private darkNoData: string = '';
  private currentIndex: number = -1;
  private seriesIndex: any;
  private loopTime: number = 8000;
  private resetTime: number = 8000;

  constructor(instance: any, configs: EchartsActionConfig) {
    this.instance = instance;
    const defaultOptions: EchartsActionConfig = {
      currentIndex: -1,
      loopTime: 8000,
      resetTime: 8000,
      seriesIndex: 0,
    };
    configs = Object.assign(defaultOptions, configs);
    for (const config in configs) {
      if (configs.hasOwnProperty(config)) {
        (this as any)[config] = configs[config];
      }
    }
  }

  initActions(): EchartsAction | false {
    if (!this.instance) {
      console.log('EchartsAction Tips: 未传入 echarts 实例！');
      return false;
    }
    this.echartOptions = this.instance.getOption();
    if (!this.echartOptions?.series[this.seriesIndex]?.data) {
      console.log('EchartsAction Tips: 缺少必备参数 series: data ！', this.instance);
      return false;
    }
    this.seriesLength = this.echartOptions.series[this.seriesIndex].data.length;
    if (this.isSetNoData) this.tryNoData();
    if (this.seriesLength === 0) {
      console.log('data长度为零，不执行轮播！');
      return false;
    }
    return this;
  }

  isCanLoop(): boolean {
    return !this.isHighlight && !this.isShowTip && !this.isSelect;
  }

  loop(): void {
    if (!this.initActions()) return;
    this.clearLoopTimer();
    this.loopTimer = setInterval(this.loopEvent.bind(this), this.loopTime);
  }

  loopEvent(): void {
    this.isCanLoop() && this.clearLoopTimer();
    this.doDownplay();
    this.isSelect && this.doUnselect();
    this.currentIndex = (this.currentIndex + 1) % this.seriesLength;
    this.customLoopCallback &&
      this.customLoopCallback({
        currentIndex: this.currentIndex,
        seriesIndex: this.seriesIndex,
      });
    this.isHighlight && this.doHighlight();
    this.isSelect && this.doSelect();
    this.isShowTip && this.doShowTip();
  }

  doDispatchAction(type: string, currentIndex?: number, seriesIndex?: number): EchartsAction {
    this.seriesIndex = <number>(!isNaN(seriesIndex as number) ? seriesIndex : this.seriesIndex);
    this.currentIndex = <number>(!isNaN(currentIndex as number) ? currentIndex : this.currentIndex);
    this.instance.dispatchAction({
      type: type,
      seriesIndex: this.seriesIndex,
      dataIndex: this.currentIndex,
    });
    return this;
  }

  doHighlight(currentIndex?: number, seriesIndex?: number): EchartsAction {
    return this.doDispatchAction('highlight', currentIndex, seriesIndex);
  }

  doSelect(currentIndex?: number, seriesIndex?: number): EchartsAction {
    return this.doDispatchAction('select', currentIndex, seriesIndex);
  }

  doUnselect(currentIndex?: number, seriesIndex?: number): EchartsAction {
    return this.doDispatchAction('unselect', currentIndex, seriesIndex);
  }

  doToggleSelected(currentIndex?: number, seriesIndex?: number): EchartsAction {
    return this.doDispatchAction('toggleSelected', currentIndex, seriesIndex);
  }

  doDownplay(currentIndex?: number, seriesIndex?: number): EchartsAction {
    return this.doDispatchAction('downplay', currentIndex, seriesIndex);
  }

  doShowTip(currentIndex?: number, seriesIndex?: number): EchartsAction {
    return this.doDispatchAction('showTip', currentIndex, seriesIndex);
  }

  setShowTip(flag: boolean = true): EchartsAction {
    this.isShowTip = flag;
    return this;
  }

  setHighlight(flag: boolean = true): EchartsAction {
    this.isHighlight = flag;
    return this;
  }

  setSelect(flag: boolean = true): EchartsAction {
    this.isSelect = flag;
    return this;
  }

  stopAllDownplay(): EchartsAction {
    this.instance.dispatchAction({
      type: 'downplay',
      seriesIndex: this.seriesIndex,
    });
    return this;
  }

  stopAllSelect(): EchartsAction {
    this.instance.dispatchAction({
      type: 'unselect',
      seriesIndex: this.seriesIndex,
      dataIndex: 0,
    });
    return this;
  }

  stop(): EchartsAction {
    this.clearLoopTimer();
    this.currentIndex = -1;
    return this;
  }

  bindMouseover(): EchartsAction {
    this.instance.on('mouseover', (el: any) => {
      if (this.customMouseoverCallback) {
        const obj = this.computedCurrentData(el);
        this.customMouseoverCallback(obj);
        this.executeMouseoverEvent(obj);
      } else {
        this.clearLoopTimer();
        this.executeMouseoverEvent(this.computedCurrentData(el));
        this.stopAllDownplay().stopAllSelect();
        this.isSelect && this.doSelect();
        this.isHighlight && this.doHighlight();
      }
    });
    return this;
  }

  computedCurrentData(el: any): { currentIndex: number; seriesIndex: number; source: any } {
    if (el) {
      this.currentIndex = el.dataIndex;
      this.seriesIndex = el.seriesIndex;
    }
    return {
      currentIndex: this.currentIndex,
      seriesIndex: this.seriesIndex,
      source: el,
    };
  }

  setCurrentIndex(index: number): EchartsAction {
    this.currentIndex = index;
    return this;
  }

  setSeriesIndex(index: number): EchartsAction {
    this.seriesIndex = index;
    return this;
  }

  bindMouseout(): EchartsAction {
    this.clearResetTimer();
    const resetLoop = () => {
      this.clearResetTimer();
      this.executeMouseoutEvent();
      this.loop();
    };
    this.instance.on('mouseout', () => {
      this.customMouseoutCallback && this.customMouseoutCallback();
      this.resetTimer = setTimeout(() => resetLoop(), this.resetTime);
    });
    return this;
  }

  bindGlobalout(): EchartsAction {
    this.clearResetTimer();
    const resetLoop = () => {
      this.clearResetTimer();
      this.loop();
      this.executeGlobaloutEvent();
    };
    this.instance.on('globalout', () => {
      this.customGlobaloutCallback && this.customGlobaloutCallback();
      this.resetTimer = setTimeout(() => resetLoop(), this.resetTime);
    });
    return this;
  }

  setOption(option?: EchartOptions): EchartsAction {
    if (option) this.echartOptions = option;
    this.instance.setOption(this.echartOptions);
    return this;
  }

  setResetTime(time: number): EchartsAction {
    this.resetTime = time;
    return this;
  }

  setLoopTime(time: number): EchartsAction {
    this.loopTime = time;
    return this;
  }

  setNoData(flag: boolean = true, config?: { text: string; theme: string }): EchartsAction {
    this.isSetNoData = flag;
    if (config) {
      this.noDataConfig = Object.assign(
        {
          theme: 'light',
          text: '暂无数据',
        },
        config
      );
    }
    return this;
  }

  tryNoData(): EchartsAction {
    const _graphic = this.getGraphic(this.noDataConfig);
    if (
      this.echartOptions?.graphic &&
      this.isArray(this.echartOptions?.graphic[0].elements)
    ) {
      const index = this.echartOptions.graphic[0].elements.findIndex(
        (el) => el.__isMounted
      );
      if (index !== -1) {
        this.echartOptions.graphic[0].elements[index] = Object.assign(
          this.echartOptions.graphic[0].elements[index],
          _graphic
        );
      } else {
        this.echartOptions.graphic = Array.from(
          new Set([...this.echartOptions.graphic[0].elements, _graphic])
        );
      }
    }
    if (!this.echartOptions.graphic) this.echartOptions.graphic = [_graphic];
    const timer = setTimeout(() => {
      this.setOption();
      clearTimeout(timer);
    }, 10);
    return this.setOption();
  }

  getGraphic(config: any): any {
    return {
      __isMounted: 'Mounted',
      type: 'image',
      left: config.left || 'center',
      top: config.top || 'middle',
      silent: true,
      scaleX: config.scaleX || 1,
      scaleY: config.scaleY || 1,
      invisible: config.bindVisible
        ? !config.bindVisible()
        : this.seriesLength > 0,
      style: {
        image:
          config.theme === 'dark' ? this.darkNoData : this.lightNoData,
      },
      textContent: {
        invisible: config.bindVisible
          ? !config.bindVisible()
          : this.seriesLength > 0,
        style: {
          text: config.text || '暂无数据',
          font: config.font || '',
          fill: config.color
            ? config.color
            : config.theme === 'dark'
            ? 'rgba(255, 255, 255, .85)'
            : 'rgba(0, 0, 0, .85)',
        },
      },
      textConfig: {
        origin: 'center',
        scaleX: config.scaleX || 1,
        scaleY: config.scaleY || 1,
        top: config.top || 'middle',
        position: config.position || (config.theme === 'dark' ? [38, 180] : [23, 110]),
      },
    };
  }

  isArray(item: any): boolean {
    if (!item) return false;
    return Object.prototype.toString.call(item) === '[object Array]';
  }

  isObject(item: any): boolean {
    if (!item) return false;
    return Object.prototype.toString.call(item) === '[object Object]';
  }

  clearLoopTimer(): EchartsAction {
    this.loopTimer && clearInterval(this.loopTimer);
    return this;
  }

  clearResetTimer(): EchartsAction {
    this.resetTimer && clearInterval(this.resetTimer);
    return this;
  }

  destroy(): void {
    if (this.instance) {
      this.instance.off();
      this.instance.dispose();
    }
    this.mouseoverEvent.clear();
  }

  addMouseoverCallback(cb: EchartEventCallback): EchartsAction {
    this.mouseoverEvent.add(cb);
    return this;
  }

  addMouseoutCallback(cb: EchartEventCallback): EchartsAction {
    this.mouseoutEvent.add(cb);
    return this;
  }

  addGlobaloutCallback(cb: EchartEventCallback): EchartsAction {
    this.globaloutEvent.add(cb);
    return this;
  }

  executeMouseoverEvent(obj: any): void {
    for (const callback of this.mouseoverEvent) {
      callback && callback(obj);
    }
  }

  executeMouseoutEvent(): void {
    for (const callback of this.mouseoutEvent) {
      callback && callback();
    }
  }

  executeGlobaloutEvent(): void {
    for (const callback of this.globaloutEvent) {
      callback && callback();
    }
  }
}

export default EchartsAction;
