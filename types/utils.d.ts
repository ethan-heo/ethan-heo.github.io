type EmptyObject = Record<any, any>

type OverrideObject<
  TTarget extends EmptyObject,
  TTargetProperty extends keyof TTarget,
  TObject extends { [key in TTargetProperty]: any },
> = Omit<TTarget, TTargetProperty> & TObject

type PickUnion<T, K extends keyof T, U extends T[K]> = Extract<T, { [P in K]: U }>

type ArrayElement<A extends readonly unknown[]> = A extends (infer E)[] ? E : never
