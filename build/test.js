var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function doubleAfter2Seconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x * 2);
        }, 2000);
    });
}
function addAsync(x) {
    return __awaiter(this, void 0, void 0, function* () {
        const a = yield doubleAfter2Seconds(10);
        const b = yield doubleAfter2Seconds(20);
        const c = yield doubleAfter2Seconds(30);
        return x + a + b + c;
    });
}
addAsync(10).then((sum) => {
    console.log(sum);
});
//# sourceMappingURL=test.js.map