// NEON REQUIEM — HELIX vertical slice: deterministic sector/encounter progression.
// Standalone ES module, prepared for integration with the current canvas game.
// No DOM dependencies. Does not change the live game until imported.
export class SectorRun {
  constructor({ sectors, onEvent = () => {} }) {
    if (!Array.isArray(sectors) || !sectors.length) throw new Error("sectors required");
    this.sectors = sectors.map((s, i) => ({
      id: s.id ?? `sector-${i + 1}`,
      waves: Math.max(1, Math.floor(s.waves ?? 1)),
      boss: Boolean(s.boss),
    }));
    this.onEvent = onEvent;
    this.index = 0;
    this.wave = 0;
    this.activeEnemies = 0;
    this.completed = new Set();
    this.state = "ready";
    this.securedLoot = [];
    this.unsecuredLoot = [];
    this.xp = 0;
  }
  get sector() { return this.sectors[this.index] ?? null; }
  start() {
    if (this.state !== "ready") return false;
    this.state = "fighting";
    this.wave = 1;
    this.onEvent({ type: "wave", sector: this.sector.id, wave: this.wave });
    return true;
  }
  setEnemyCount(count) {
    if (this.state !== "fighting") return;
    this.activeEnemies = Math.max(0, Math.floor(count));
    if (this.activeEnemies === 0) this.clearWave();
  }
  clearWave() {
    if (this.state !== "fighting") return;
    if (this.wave < this.sector.waves) {
      this.wave++;
      this.onEvent({ type: "wave", sector: this.sector.id, wave: this.wave });
      return;
    }
    this.completed.add(this.sector.id);
    this.securedLoot.push(...this.unsecuredLoot);
    this.unsecuredLoot = [];
    this.state = "checkpoint";
    this.onEvent({ type: "checkpoint", sector: this.sector.id, boss: this.sector.boss });
  }
  earnXP(amount) { this.xp += Math.max(0, Number(amount) || 0); }
  pickUp(item) { this.unsecuredLoot.push(item); }
  nextSector() {
    if (this.state !== "checkpoint") return false;
    if (this.index + 1 >= this.sectors.length) {
      this.state = "complete";
      this.onEvent({ type: "missionComplete" });
      return true;
    }
    this.index++;
    this.wave = 0;
    this.activeEnemies = 0;
    this.state = "ready";
    return true;
  }
  retreat() {
    if (this.state === "fighting" || this.state === "ready") this.unsecuredLoot = [];
    this.state = "retreated";
    this.onEvent({ type: "retreat", checkpoint: [...this.completed], xp: this.xp });
  }
  die() {
    if (this.state !== "fighting") return;
    this.unsecuredLoot = [];
    this.wave = 0;
    this.activeEnemies = 0;
    this.state = "ready";
    this.onEvent({ type: "respawn", sector: this.sector.id });
  }
  snapshot() {
    return {
      sector: this.sector?.id ?? null, wave: this.wave, state: this.state,
      completed: [...this.completed], xp: this.xp,
      securedLoot: [...this.securedLoot], unsecuredLoot: [...this.unsecuredLoot],
    };
  }
}
