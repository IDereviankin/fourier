import P5 from 'p5';

const body = document.getElementsByTagName('body')[0];

const dft = (x: number[]) => {
    const N = x.length;
    const X = Array<{ amp: number, phase: number, freq: number }>(N);

    for (let m = 0; m < N; m += 1) {
        let re = 0;
        let im = 0;

        for (let n = 0; n < N; n += 1) {
            re += x[n] * Math.cos(2 * Math.PI * n * m / N);
            im -= x[n] * Math.sin(2 * Math.PI * n * m / N);
        }

        re /= N;
        im /= N;

        const amp = Math.hypot(re, im);
        const phase = Math.atan2(im, re);
        const freq = m;

        X[m] = { amp, phase, freq };
    }

    return X;
};

const sketch = (p5: P5) => {
    const N = 100;
    const xs = Array<number>(N);

    for (let i = 0; i < N; i += 1) {
        xs[i] = i < (N / 2) ? -50 : 50;
    }

    let cycles = dft(xs);

    cycles = cycles.filter(x => x.amp > 1);
    cycles.sort((a, b) => b.amp - a.amp);

    cycles.forEach(console.log);

    let angle = 0;
    const vertexes: (readonly [number, number])[] = [];

    p5.setup = () => {
        const canvas = p5.createCanvas(600, 300);
        canvas.parent(body);

        p5.noFill();
        p5.stroke(255);
        p5.strokeWeight(1.5);
    };

    p5.draw = () => {
        p5.background(0);

        let vertex = [p5.width / 6, p5.height / 2] as const;

        p5.push();
        {
            p5.translate(p5.width / 6, p5.height / 2);
            for (let i = 0; i < cycles.length; i += 1) {
                const r = cycles[i].amp;
                const freq = cycles[i].freq;
                const phase = cycles[i].phase;
                const x = r * p5.cos(angle * freq + phase + p5.HALF_PI);
                const y = r * p5.sin(angle * freq + phase + p5.HALF_PI);

                p5.push();
                p5.stroke(255, 50);
                p5.circle(0, 0, r * 2);
                p5.line(0, 0, x, y);
                p5.pop();

                p5.push();
                p5.strokeWeight(2);
                p5.point(x, y);
                p5.pop();

                vertex = vertex.map((v, i) => v + [x, y][i]) as [number, number];
                p5.translate(x, y);
            }
        }
        p5.pop();

        vertexes.unshift(vertex);

        p5.push();
        p5.stroke(255);
        p5.beginShape();
        vertexes.forEach(([x, y], i) => p5.vertex(i + 250, y));
        p5.endShape();
        p5.pop();

        p5.push();
        p5.stroke(255, 50);
        p5.strokeWeight(1);
        p5.line(vertexes[0][0], vertexes[0][1], 250, vertexes[0][1]);
        p5.pop();

        angle += p5.TWO_PI / N;
        if (angle >= p5.TWO_PI) {
            angle = 0;
        }

        if (vertexes.length > 1400) vertexes.pop();
    };
};

new P5(sketch);