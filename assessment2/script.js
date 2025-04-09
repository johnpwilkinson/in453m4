// Credit: Adapted from "Introduction to Algorithms" by Cormen et al., and https://www.geeksforgeeks.org/merge-sort/
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex), right.slice(rightIndex));
}

function mergeSortOptimized1(arr) {
  if (arr.length <= 30) {
    return insertionSort(arr);
  }

  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  return merge(mergeSortOptimized1(left), mergeSortOptimized1(right));
}

function mergeSortOptimized2(arr) {
  if (arr.length <= 30) {
    return insertionSort(arr);
  }

  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  if (left[left.length - 1] <= right[0]) {
    return left.concat(right);
  }

  return merge(mergeSortOptimized2(left), mergeSortOptimized2(right));
}

function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

function generateData(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 10000));
}

function generateEdgeCaseData() {
  return {
    sorted: Array.from({ length: 1000 }, (_, i) => i),
    reversed: Array.from({ length: 1000 }, (_, i) => 1000 - i),
    empty: [],
  };
}

function measureTime(sortFn, data, label) {
  const start = performance.now();
  const sorted = sortFn([...data]);
  const end = performance.now();
  const elapsed = end - start;
  console.log(`${label}: ${elapsed.toFixed(2)}ms for ${data.length} items`);
  return { elapsed, sorted };
}

function main() {
  const smallData = generateData(10);
  const mediumData = generateData(1000);
  const largeData = generateData(10000);
  const largeData2 = generateData(100000);

  const edgeCaseData = generateEdgeCaseData();

  console.log("Original Merge Sort Results:");
  measureTime(mergeSort, smallData, "Small");
  measureTime(mergeSort, mediumData, "Medium");
  measureTime(mergeSort, largeData, "Large");
  measureTime(mergeSort, largeData2, "Very Large");

  console.log("\nMerge Sort with First Optimization Results:");
  measureTime(mergeSortOptimized1, smallData, "Small");
  measureTime(mergeSortOptimized1, mediumData, "Medium");
  measureTime(mergeSortOptimized1, largeData, "Large");
  measureTime(mergeSortOptimized1, largeData2, "Very Large");

  console.log("\nMerge Sort with Both Optimizations Results:");
  measureTime(mergeSortOptimized2, smallData, "Small");
  measureTime(mergeSortOptimized2, mediumData, "Medium");
  measureTime(mergeSortOptimized2, largeData, "Large");
  measureTime(mergeSortOptimized2, largeData2, "Very Large");

  console.log("\nEdge Case Results:");
  measureTime(mergeSort, edgeCaseData.sorted, "Sorted (Merge Sort)");
  measureTime(mergeSort, edgeCaseData.reversed, "Reversed (Merge Sort)");
  measureTime(mergeSort, edgeCaseData.empty, "Empty (Merge Sort)");

  measureTime(
    mergeSortOptimized1,
    edgeCaseData.sorted,
    "Sorted (Merge Sort with First Optimization)"
  );
  measureTime(
    mergeSortOptimized1,
    edgeCaseData.reversed,
    "Reversed (Merge Sort with First Optimization)"
  );
  measureTime(
    mergeSortOptimized1,
    edgeCaseData.empty,
    "Empty (Merge Sort with First Optimization)"
  );

  measureTime(
    mergeSortOptimized2,
    edgeCaseData.sorted,
    "Sorted (Merge Sort with Both Optimizations)"
  );
  measureTime(
    mergeSortOptimized2,
    edgeCaseData.reversed,
    "Reversed (Merge Sort with Both Optimizations)"
  );
  measureTime(
    mergeSortOptimized2,
    edgeCaseData.empty,
    "Empty (Merge Sort with Both Optimizations)"
  );
}

main();
