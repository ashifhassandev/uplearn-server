export interface IBaseUseCase<TInput, TOutput = void> {
  execute(input: TInput): Promise<TOutput>;
}