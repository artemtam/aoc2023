// RegExp-s for parsing

const CD_REGEXP = /^\$ cd (?<dirName>.+)$/;
const CD_ROOT = '/';
const CD_MOVE_OUT = '..';

const LS_REGEXP = /^\$ ls$/;
const LS_RESULT_DIR_REGEXP = /^dir (?<dirName>.+)$/;
const LS_RESULT_FILE_REGEXP = /^(?<fileSize>\d+) (?<fileName>.+)$/;

// Magic numbers for Part 2

const TOTAL_FILE_SYSTEM_SIZE = 70_000_000;
const REQUIRED_TO_UPDATE_SIZE = 30_000_000;

class FileNode {
    public readonly name: string;
    public readonly size: number;

    constructor(name: string, size: number) {
        this.name = name;
        this.size = size;
    }
}

class DirNode {
    public readonly name: string;
    public readonly dirs: DirNode[];
    public readonly files: FileNode[];
    public readonly parent: DirNode | null; // reference to the parent dir for easier cd ..

    constructor(name: string, parent: DirNode | null = null, dirs: DirNode[] = [], files: FileNode[] = []) {
        this.name = name;
        this.parent = parent;
        this.dirs = dirs;
        this.files = files;
    }

    public findDir(name: string): DirNode | null {
        return this.dirs.find((dir) => dir.name === name) || null;
    }

    public addDir(dir: DirNode): void {
        this.dirs.push(dir);
    }

    public addFile(file: FileNode): void {
        this.files.push(file);
    }

    public get size(): number {
        /**
         * It's not efficient to calculate the size like that, as you will see in tree traversal aggregation.
         * We could memoize calculated size, and update/invalidate it on dir update (update its own value and
         * call parent.invalidateSize(), for example). But for the given input, it's good enough.
         */

        const allFileSize = this.files.reduce((total, file) => {
            return total + file.size;
        }, 0);

        const allDirsSize = this.dirs.reduce((total, dir) => {
            return total + dir.size;
        }, 0);

        return allFileSize + allDirsSize;
    }
}

/**
 * Parses input and builds a file system tree
 */
const parseInput = (input: string): DirNode => {
    const root = new DirNode('/');

    let currentDir = root; // track which dir we are at
    let readingLsResult = false; // track if reading `ls` result

    input.split('\n').forEach((line) => {
        if (line[0] === '$') { // if a command
            readingLsResult = false; // not reading ls result anymore

            if (CD_REGEXP.test(line)) { // if cd command
                const matches = CD_REGEXP.exec(line);

                if (matches === null || !matches.groups?.dirName) {
                    throw new Error(`Can not parse cd command: ${line}`);
                }

                const { dirName } = matches.groups;

                if (dirName === CD_ROOT) {
                    currentDir = root;
                } else if (dirName === CD_MOVE_OUT) {
                    if (currentDir.parent === null) {
                        throw new Error(`Can not move out of ${currentDir.name}: ${line}`);
                    }

                    currentDir = currentDir.parent;
                } else {
                    const targetDir = currentDir.findDir(dirName);

                    if (targetDir === null) {
                        throw new Error(`Can not find ${dirName} in ${currentDir.name}: ${line}`);
                    }

                    currentDir = targetDir;
                }
            } else if (LS_REGEXP.test(line)) { // if ls command
                readingLsResult = true; // next lines are reading ls result
            }
        } else if (readingLsResult) {
            if (LS_RESULT_DIR_REGEXP.test(line)) { // new dir
                const matches = LS_RESULT_DIR_REGEXP.exec(line);

                if (matches === null || !matches.groups?.dirName) {
                    throw new Error(`Can not parse ls result line: ${line}`);
                }

                const { dirName } = matches.groups;

                const newDir = new DirNode(dirName, currentDir);

                currentDir.addDir(newDir);
            } else if (LS_RESULT_FILE_REGEXP.test(line)) { // new file
                const matches = LS_RESULT_FILE_REGEXP.exec(line);

                if (matches === null || !matches.groups?.fileName || !matches.groups?.fileSize) {
                    throw new Error(`Can not parse ls result line: ${line}`);
                }

                const { fileSize, fileName } = matches.groups;

                const newFile = new FileNode(fileName, Number(fileSize));

                currentDir.addFile(newFile);
            }
        }
    });

    return root;
}


const solvePart1 = (input: string): number => {
    const root = parseInput(input);

    let totalSize = 0;

    // DFS

    let stack: DirNode[] = [root];

    while (stack.length !== 0) {
        const node = stack.pop()!; // ! because the node is always there

        if (node!.size <= 100000) {
            totalSize += node.size;
        }

        stack.push(...node.dirs);
    }

    return totalSize;
};

const solvePart2 = (input: string): number => {
    const root = parseInput(input);

    const sizeToFreeUp = REQUIRED_TO_UPDATE_SIZE - (TOTAL_FILE_SYSTEM_SIZE - root.size);

    let smallestToRemove = root.size; // root is the max

    // BFS

    let queue: DirNode[] = [root];

    while (queue.length !== 0) {
        const node = queue.shift()!; // ! because the node is always there

        if (node.size >= sizeToFreeUp) {
            smallestToRemove = Math.min(smallestToRemove, node.size)
        }

        queue.push(...node.dirs);
    }

    return smallestToRemove;
};

export { solvePart1, solvePart2 };