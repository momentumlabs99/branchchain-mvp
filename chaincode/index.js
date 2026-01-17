'use strict';

const { Contract } = require('fabric-contract-api');

class BranchChainContract extends Contract {

    /**
     * Initialize the ledger with some initial data if needed
     */
    async InitLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const initialRecord = {
            id: 'INITIAL_RECORD',
            action: 'INITIALIZE',
            timestamp: new Date().toISOString(),
            message: 'BranchChain Ledger Initialized'
        };
        await ctx.stub.putState(initialRecord.id, Buffer.from(JSON.stringify(initialRecord)));
        console.info('============= END : Initialize Ledger ===========');
    }

    /**
     * Record a banking operation on the ledger
     * @param {Context} ctx the transaction context
     * @param {String} actionType e.g., CREATE_ACCOUNT, RESET_PIN, REPLACE_CARD
     * @param {String} data JSON string containing operation details
     */
    async RecordOperation(ctx, actionType, data) {
        const txId = ctx.stub.getTxId();
        const timestamp = ctx.stub.getTxTimestamp();
        const date = new Date(timestamp.seconds * 1000).toISOString();

        const operation = {
            docType: 'operation',
            txId: txId,
            actionType: actionType,
            details: JSON.parse(data),
            timestamp: date,
        };

        // Use txId as the key to ensure uniqueness and traceability
        await ctx.stub.putState(txId, Buffer.from(JSON.stringify(operation)));
        
        return txId;
    }

    /**
     * Query operation by transaction ID
     */
    async QueryOperation(ctx, txId) {
        const operationJSON = await ctx.stub.getState(txId);
        if (!operationJSON || operationJSON.length === 0) {
            throw new Error(`Operation with TxId ${txId} does not exist`);
        }
        return operationJSON.toString();
    }

    /**
     * Get all operations recorded on the ledger
     */
    async GetAllOperations(ctx) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    /**
     * Get history of operations for a specific ID (if assets were tracked by ID)
     * Useful for tracking all changes to a specific account
     */
    async GetHistoryForRecord(ctx, recordId) {
        const resultsIterator = await ctx.stub.getHistoryForKey(recordId);
        const results = [];
        let res = await resultsIterator.next();
        while (!res.done) {
            if (res.value) {
                const obj = JSON.parse(res.value.value.toString('utf8'));
                results.push(obj);
            }
            res = await resultsIterator.next();
        }
        await resultsIterator.close();
        return JSON.stringify(results);
    }
}

module.exports = BranchChainContract;
