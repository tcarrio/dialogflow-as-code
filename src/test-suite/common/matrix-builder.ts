import {
  MatrixIntent,
  ConfusionMatrix,
  LabelMap,
  ReportableMatrix,
} from "../common-interfaces/data-interfaces";
export class MatrixBuilder {
  private static createMatrix(intents: MatrixIntent[]): ConfusionMatrix {
    const returnMatrix: ConfusionMatrix = {};
    for (const intentName in intents) {
      if (returnMatrix[intents[intentName].intended]) {
        returnMatrix[intents[intentName].intended].push(intents[intentName]);
      } else returnMatrix[intents[intentName].intended] = [intents[intentName]];
      if (!returnMatrix[intents[intentName].actual]) {
        returnMatrix[intents[intentName].actual] = [];
      }
    }
    return returnMatrix;
  }
  private static createLabels(matrix: ConfusionMatrix): LabelMap {
    const labels = [];
    const numbers: {
      //this map will be tasked with assigning indices to intents that already exist (in a seperate map)
      [_: string]: number;
    } = {};
    for (const intentName in matrix) {
      numbers[intentName] = labels.length;
      labels.push(intentName);
    }
    return { labels, numbers };
  }
  public static generateReportableMatrix(
    results: MatrixIntent[],
  ): ReportableMatrix {
    const matrix = this.createMatrix(results);
    const labelMap = this.createLabels(matrix);
    const data = new Array(labelMap.labels.length)
      .fill(0)
      .map(() => new Array(labelMap.labels.length).fill(0));
    for (const xAxisIntentName in matrix) {
      matrix[xAxisIntentName].forEach((_intent, yAxisIntentIndex) => {
        const yAxisIntentName =
          matrix[xAxisIntentName][yAxisIntentIndex].actual;
        const xAxisValue = labelMap.numbers[xAxisIntentName];
        const yAxisValue = labelMap.numbers[yAxisIntentName];
        data[xAxisValue][yAxisValue]++;
      });
    }
    return {
      labels: labelMap.labels,
      data,
    };
  }
}
