const readline = require("readline");

class Semaphore {
  constructor(max) {
    this.max = max;
    this.current = 0;
    this.queue = [];
  }

  async acquire() {
    if (this.current < this.max) {
      this.current++;
      return;
    }
    return new Promise((resolve) => this.queue.push(resolve));
  }

  release() {
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      resolve();
    } else {
      this.current--;
    }
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function formatTime(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  } else {
    return `${mins}m`;
  }
}
async function runScenario(
  numCustomers,
  numRooms,
  numItemsSetting,
  scenarioNumber
) {
  console.log(`\n--- Running Scenario ${scenarioNumber} ---`);
  const semaphore = new Semaphore(numRooms);
  const startTime = 0;
  let currentTime = 0;

  const results = [];

  const customers = Array.from({ length: numCustomers }, (_, i) => ({
    id: i + 1,
    items:
      numItemsSetting === 0 ? randomInt(1, 6) : Math.min(numItemsSetting, 20),
  }));

  const roomAvailableAt = Array(numRooms).fill(0);

  for (const customer of customers) {
    let soonestRoomIndex = 0;
    for (let i = 1; i < numRooms; i++) {
      if (roomAvailableAt[i] < roomAvailableAt[soonestRoomIndex]) {
        soonestRoomIndex = i;
      }
    }

    const waitTime = Math.max(
      0,
      roomAvailableAt[soonestRoomIndex] - currentTime
    );
    const usageTime = Array.from({ length: customer.items }).reduce(
      (sum) => sum + randomInt(1, 3),
      0
    );

    const enterTime = currentTime + waitTime;
    const exitTime = enterTime + usageTime;

    roomAvailableAt[soonestRoomIndex] = exitTime;

    results.push({
      customerId: customer.id,
      items: customer.items,
      waitTime,
      usageTime,
      enterTime,
      exitTime,
    });

    currentTime = Math.max(currentTime, enterTime);
  }

  const totalTime = Math.max(...results.map((r) => r.exitTime));
  const totalItems = results.reduce((sum, r) => sum + r.items, 0);
  const totalUsageTime = results.reduce((sum, r) => sum + r.usageTime, 0);
  const totalWaitTime = results.reduce((sum, r) => sum + r.waitTime, 0);

  console.log(
    `Scenario ${scenarioNumber}:\n` +
      `Customers: ${numCustomers}\n` +
      `Dressing Rooms: ${numRooms}\n` +
      `Avg Items per Customer: ${(totalItems / numCustomers).toFixed(2)}\n` +
      `Avg Usage Time: ${formatTime(totalUsageTime / numCustomers)} \n` +
      `Avg Wait Time: ${formatTime(totalWaitTime / numCustomers)} \n` +
      `Total Time Elapsed: ${formatTime(totalTime)}`
  );

  return results;
}

async function promptUser(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

async function run() {
  const usePrompt = process.argv.includes("--prompt");

  const scenarios = [];

  if (usePrompt) {
    for (let i = 1; i <= 3; i++) {
      const numCustomers = parseInt(
        await promptUser(`Scenario ${i} - Number of customers: `),
        10
      );
      const numRooms = parseInt(
        await promptUser(`Scenario ${i} - Number of dressing rooms: `),
        10
      );
      const numItemsSetting = parseInt(
        await promptUser(
          `Scenario ${i} - Number of items per customer (0 for random): `
        ),
        10
      );

      scenarios.push({ numCustomers, numRooms, numItemsSetting });
    }
  } else {
    scenarios.push({ numCustomers: 10, numRooms: 3, numItemsSetting: 0 });
    scenarios.push({ numCustomers: 20, numRooms: 3, numItemsSetting: 0 });
    scenarios.push({ numCustomers: 20, numRooms: 3, numItemsSetting: 0 });
  }

  for (let i = 0; i < scenarios.length; i++) {
    await runScenario(
      scenarios[i].numCustomers,
      scenarios[i].numRooms,
      scenarios[i].numItemsSetting,
      i + 1
    );
  }
}

run();
