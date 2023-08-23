type EmptyObject = Record<any, any>

type OverrideObject<TTarget extends EmptyObject, TTargetProperty extends keyof TTarget, TObject extends {[key in TTargetProperty] : any}> = Omit<TTarget, TTargetProperty> & TObject