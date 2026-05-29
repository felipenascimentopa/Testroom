import {
  f,
  m
} from "./chunk-3JBRN5E6.js";
import {
  e
} from "./chunk-DQCLM46N.js";
import {
  P,
  W
} from "./chunk-4DGFRLMJ.js";
import {
  __async
} from "./chunk-QHQP2P2Z.js";

// node_modules/@ionic/core/components/p-CneGxKsZ.js
var n = () => {
  const n2 = window;
  n2.addEventListener("statusTap", (() => {
    W((() => {
      const o = document.elementFromPoint(n2.innerWidth / 2, n2.innerHeight / 2);
      if (!o) return;
      const e2 = f(o);
      e2 && new Promise(((o2) => e(e2, o2))).then((() => {
        P((() => __async(null, null, function* () {
          e2.style.setProperty("--overflow", "hidden"), yield m(e2, 300), e2.style.removeProperty("--overflow");
        })));
      }));
    }));
  }));
};
export {
  n as startStatusTap
};
//# sourceMappingURL=p-CneGxKsZ-G332MKPZ.js.map
