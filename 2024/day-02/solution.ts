export const solvePart1 = (input: string): number => {
    let safeReports = 0;
    const reports = input.trim().split('\n');

    for (const report of reports) {
        const levels = report.trim().split(' ').map(Number);

        if (isReportSafe(levels)) {
            safeReports++;
        }
    }

    return safeReports;
};

export const solvePart2 = (input: string): number => {
    let safeReports = 0.
    const reports = input.trim().split('\n');

    for (const report of reports) {
        const levels = report.trim().split(' ').map(Number);

        if (isReportSafe(levels)) {
            safeReports++;
        } else {
            // if original report is unsafe -> try removing one level at a time

            for (let i = 0; i < levels.length; i++) {
                const variant = [...levels];
                variant.splice(i, 1);

                if (isReportSafe(variant)) {
                    safeReports++;
                    break;
                }
            }
        }
    }

    return safeReports;
};

/**
 * @description Check if the given report is safe based on the task rules
 */
const isReportSafe = (levels: number[]): boolean => {
    const increasing = levels[1] > levels[0];

    for (let i = 1; i < levels.length; i++) {
        const diff = levels[i] - levels[i - 1];

        if (increasing && (diff < 1 || diff > 3)) {
            return false;
        }

        if (!increasing && (diff > -1 || diff < -3)) {
            return false;
        }
    }

    return true;
};
