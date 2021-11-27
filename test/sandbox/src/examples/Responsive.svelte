<script>
  import { Graphic } from '../../../../src/index.js'
</script>

<style>
  .container {
    width: 800px;
    height: 400px;
    display: grid;
    grid-template-columns: auto auto auto;
    background-color: #2196F3;
    padding: 10px;
  }

  .cell {
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.8);
    padding: 20px;
  }
</style>

<div class="container">
  <div class="cell">
    <Graphic width="100%" height="100%" backgroundColor="red" />
  </div>
  <div class="cell">
    <Graphic width="100%" height="100%" backgroundColor="orange" />
  </div>
  <div class="cell">
    <Graphic width="100%" height="100%" backgroundColor="green" />
  </div>
</div>