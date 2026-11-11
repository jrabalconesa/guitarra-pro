import test from 'node:test';
import assert from 'node:assert/strict';
import {parseSongText} from './song-import.mjs';
test('tab string names never become extra chords in a mixed PDF transcription',()=>{
 const tab='e|--0--1--3--1--0--|\nB|----------------|\nG|----------------|\nD|----------------|\nA|----------------|\nE|----------------|';
 const p=parseSongText('Em | C | G | D\n'+tab);
 assert.deepEqual(p.sequence,['Em','C','G','D']);
 assert.equal(p.notes.length,5);
 assert.deepEqual(parseSongText(tab).sequence,[]);
 assert.deepEqual(parseSongText('E | Am\n[A]Texto [G7]otra frase').sequence,['E','Am','A','G7']);
});
