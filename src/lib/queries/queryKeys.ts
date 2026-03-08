class WorkspaceQueryKeys {
  private static readonly base = 'workspaces' as const;

  static all() {
    return [this.base] as const;
  }

  static list() {
    return [...this.all(), 'list'] as const;
  }

  static detail(id: string) {
    return [...this.all(), 'detail', id] as const;
  }
}

class BoardQueryKeys {
  private static readonly base = 'boards' as const;

  static all() {
    return [this.base] as const;
  }

  static list(workspaceId: string) {
    return [...this.all(), 'list', workspaceId] as const;
  }

  static detail(id: string) {
    return [...this.all(), 'detail', id] as const;
  }

  static full(id: string) {
    return [...this.all(), 'full', id] as const;
  }
}

class ListQueryKeys {
  private static readonly base = 'lists' as const;

  static all() {
    return [this.base] as const;
  }

  static byBoard(boardId: string) {
    return [...this.all(), 'byBoard', boardId] as const;
  }

  static detail(id: string) {
    return [...this.all(), 'detail', id] as const;
  }
}

class CardQueryKeys {
  private static readonly base = 'cards' as const;

  static all() {
    return [this.base] as const;
  }

  static byList(listId: string) {
    return [...this.all(), 'byList', listId] as const;
  }

  static detail(id: string) {
    return [...this.all(), 'detail', id] as const;
  }
}

class LabelQueryKeys {
  private static readonly base = 'labels' as const;

  static all() {
    return [this.base] as const;
  }

  static byBoard(boardId: string) {
    return [...this.all(), 'byBoard', boardId] as const;
  }

  static detail(id: string) {
    return [...this.all(), 'detail', id] as const;
  }
}

class CommentQueryKeys {
  private static readonly base = 'comments' as const;

  static all() {
    return [this.base] as const;
  }

  static byCard(cardId: string) {
    return [...this.all(), 'byCard', cardId] as const;
  }

  static detail(id: string) {
    return [...this.all(), 'detail', id] as const;
  }
}

class ChecklistItemQueryKeys {
  private static readonly base = 'checklistItems' as const;

  static all() {
    return [this.base] as const;
  }

  static byCard(cardId: string) {
    return [...this.all(), 'byCard', cardId] as const;
  }

  static detail(id: string) {
    return [...this.all(), 'detail', id] as const;
  }
}

export class QueryKeys {
  static readonly workspaces = WorkspaceQueryKeys;
  static readonly boards = BoardQueryKeys;
  static readonly lists = ListQueryKeys;
  static readonly cards = CardQueryKeys;
  static readonly labels = LabelQueryKeys;
  static readonly comments = CommentQueryKeys;
  static readonly checklistItems = ChecklistItemQueryKeys;
}
